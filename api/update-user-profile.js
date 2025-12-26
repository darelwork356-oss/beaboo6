const db = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, username, displayName, bio, profileImageUrl, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Verificar si el usuario existe
    const existing = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

    let result;
    if (existing.rows.length === 0) {
      // Crear nuevo usuario
      result = await db.query(
        `INSERT INTO users (id, email, username, display_name, bio, profile_image_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING *`,
        [userId, email, username, displayName, bio, profileImageUrl]
      );
    } else {
      // Actualizar usuario existente
      result = await db.query(
        `UPDATE users 
         SET username = COALESCE($2, username),
             display_name = COALESCE($3, display_name),
             bio = COALESCE($4, bio),
             profile_image_url = COALESCE($5, profile_image_url),
             email = COALESCE($6, email),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [userId, username, displayName, bio, profileImageUrl, email]
      );
    }

    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Failed to update user profile', message: error.message });
  }
};
