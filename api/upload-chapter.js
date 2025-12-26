const db = require('../db');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storyId, chapterNumber, title, content, userId, imageData, fileName, contentType } = req.body;

    if (!storyId || !chapterNumber || !content || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chapterId = `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let imageUrl = null;
    let s3Key = null;

    // Subir imagen a S3 si existe
    if (imageData && fileName) {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      s3Key = `chapters/${storyId}/${chapterId}_${fileName}`;

      const command = new PutObjectCommand({
        Bucket: process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025',
        Key: s3Key,
        Body: buffer,
        ContentType: contentType || 'image/jpeg',
      });

      await s3Client.send(command);
      imageUrl = `https://${process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025'}.s3.${process.env.MY_AWS_REGION || 'us-east-2'}.amazonaws.com/${s3Key}`;
    }

    // Guardar en PostgreSQL
    const result = await db.query(
      `INSERT INTO chapters (id, story_id, user_id, title, content, chapter_number, image_url, s3_key, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [chapterId, storyId, userId, title, content, chapterNumber, imageUrl, s3Key]
    );

    return res.status(200).json({ 
      success: true, 
      chapter: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading chapter:', error);
    return res.status(500).json({ error: 'Failed to upload chapter', message: error.message });
  }
};
