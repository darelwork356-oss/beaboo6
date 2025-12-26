const db = require('../db');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storyId } = req.query;

    if (!storyId) {
      return res.status(400).json({ error: 'Missing storyId' });
    }

    const result = await db.query(
      'SELECT * FROM chapters WHERE story_id = $1 ORDER BY chapter_number ASC',
      [storyId]
    );

    // Generar URLs firmadas para imágenes en S3
    const chapters = await Promise.all(result.rows.map(async (chapter) => {
      if (chapter.s3_key) {
        const command = new GetObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025',
          Key: chapter.s3_key,
        });
        chapter.image_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      }
      return chapter;
    }));

    return res.status(200).json({ chapters });
  } catch (error) {
    console.error('Error getting chapters:', error);
    return res.status(500).json({ error: 'Failed to get chapters', message: error.message });
  }
};
