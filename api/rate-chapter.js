const db = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chapterId, userId, rating } = req.body;

    if (!chapterId || !userId || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Insertar o actualizar rating
    await db.query(
      `INSERT INTO chapter_ratings (chapter_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (chapter_id, user_id) 
       DO UPDATE SET rating = $3, created_at = NOW()`,
      [chapterId, userId, rating]
    );

    // Obtener promedio de ratings
    const avgResult = await db.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings FROM chapter_ratings WHERE chapter_id = $1',
      [chapterId]
    );

    return res.status(200).json({ 
      success: true,
      avgRating: parseFloat(avgResult.rows[0].avg_rating).toFixed(2),
      totalRatings: parseInt(avgResult.rows[0].total_ratings)
    });
  } catch (error) {
    console.error('Error rating chapter:', error);
    return res.status(500).json({ error: 'Failed to rate chapter', message: error.message });
  }
};
