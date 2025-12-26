const db = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { noteId, userId } = req.body;

    if (!noteId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verificar si el usuario ya dio like
    const existingLike = await db.query(
      'SELECT * FROM note_likes WHERE note_id = $1 AND user_id = $2',
      [noteId, userId]
    );

    if (existingLike.rows.length > 0) {
      return res.status(400).json({ error: 'User already liked this note' });
    }

    // Insertar el like
    await db.query(
      'INSERT INTO note_likes (note_id, user_id) VALUES ($1, $2)',
      [noteId, userId]
    );

    // Obtener el conteo actualizado de likes
    const likesCount = await db.query(
      'SELECT COUNT(*) as likes FROM note_likes WHERE note_id = $1',
      [noteId]
    );

    return res.status(200).json({ 
      success: true, 
      likes: parseInt(likesCount.rows[0].likes) 
    });
  } catch (error) {
    console.error('Error liking note:', error);
    return res.status(500).json({ error: 'Failed to like note', message: error.message });
  }
};
