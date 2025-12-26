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
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ error: 'Missing noteId' });
    }

    // Obtener la nota de PostgreSQL
    const result = await db.query('SELECT * FROM notes WHERE id = $1', [noteId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const note = result.rows[0];

    // Eliminar imagen de S3 si existe
    if (note.s3_key) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.MY_AWS_S3_BUCKET_NAME || 'libros-de-glam-2025',
        Key: note.s3_key,
      });
      await s3Client.send(deleteCommand);
    }

    // Eliminar de PostgreSQL (CASCADE eliminará los likes)
    await db.query('DELETE FROM notes WHERE id = $1', [noteId]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ error: 'Failed to delete note', message: error.message });
  }
};
