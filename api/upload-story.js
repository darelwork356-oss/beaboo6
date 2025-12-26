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
    const { 
      title, 
      category, 
      rating, 
      language, 
      synopsis, 
      userId, 
      username, 
      email,
      coverImageData,
      coverImageFileName,
      coverImageContentType
    } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const storyId = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let coverImageUrl = null;
    let s3Key = null;

    // Subir imagen de portada a S3 si existe
    if (coverImageData && coverImageFileName) {
      const base64Data = coverImageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      s3Key = `covers/${userId}/${storyId}_${coverImageFileName}`;

      const coverCommand = new PutObjectCommand({
        Bucket: process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025',
        Key: s3Key,
        Body: buffer,
        ContentType: coverImageContentType || 'image/jpeg',
      });

      await s3Client.send(coverCommand);
      coverImageUrl = `https://${process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025'}.s3.${process.env.MY_AWS_REGION || 'us-east-2'}.amazonaws.com/${s3Key}`;
    }

    // Guardar en PostgreSQL
    const result = await db.query(
      `INSERT INTO stories (id, user_id, username, email, title, category, rating, language, synopsis, cover_image_url, s3_key, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
       RETURNING *`,
      [storyId, userId, username, email, title, category, rating, language, synopsis, coverImageUrl, s3Key]
    );

    return res.status(200).json({ 
      success: true, 
      story: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading story:', error);
    return res.status(500).json({ error: 'Failed to upload story', message: error.message });
  }
};
