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
    const { limit = 100, userId } = req.query;

    let query = `
      SELECT s.*, u.username, u.display_name, u.profile_image_url
      FROM stories s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    if (userId) {
      query += ' AND s.user_id = $1';
      params.push(userId);
    }
    
    query += ' ORDER BY s.created_at DESC LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));

    const result = await db.query(query, params);
    
    // Generar URLs firmadas para imágenes en S3
    const stories = await Promise.all(result.rows.map(async (story) => {
      if (story.s3_key) {
        const command = new GetObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025',
          Key: story.s3_key,
        });
        story.cover_image_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      }
      return story;
    }));

    return res.status(200).json({ stories });
  } catch (error) {
    console.error('Error getting stories:', error);
    return res.status(500).json({ error: 'Failed to get stories', message: error.message });
  }
};
