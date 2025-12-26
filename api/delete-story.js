const db = require('../db');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

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
    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).json({ error: 'Missing storyId' });
    }

    // Obtener la historia de PostgreSQL
    const result = await db.query('SELECT * FROM stories WHERE id = $1', [storyId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const story = result.rows[0];

    // Eliminar imagen de portada de S3 si existe
    if (story.s3_key) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025',
        Key: story.s3_key,
      });
      await s3Client.send(deleteCommand);
    }

    // Obtener y eliminar imágenes de capítulos
    const chapters = await db.query('SELECT * FROM chapters WHERE story_id = $1', [storyId]);
    for (const chapter of chapters.rows) {
      if (chapter.s3_key) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025',
          Key: chapter.s3_key,
        });
        await s3Client.send(deleteCommand);
      }
    }

    // Eliminar de PostgreSQL (CASCADE eliminará capítulos y ratings)
    await db.query('DELETE FROM stories WHERE id = $1', [storyId]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return res.status(500).json({ error: 'Failed to delete story', message: error.message });
  }
};
