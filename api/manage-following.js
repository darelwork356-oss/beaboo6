const db = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'GET') {
      const { userId, type } = req.query;

      if (!userId || !type) {
        return res.status(400).json({ error: 'Missing userId or type' });
      }

      if (type === 'following') {
        const result = await db.query(
          'SELECT following_id, created_at FROM followers WHERE follower_id = $1',
          [userId]
        );
        return res.status(200).json({ following: result.rows });
      } else if (type === 'followers') {
        const result = await db.query(
          'SELECT follower_id, created_at FROM followers WHERE following_id = $1',
          [userId]
        );
        return res.status(200).json({ followers: result.rows });
      }
    }

    if (req.method === 'POST') {
      const { action, userId, targetUserId } = req.body;

      if (!action || !userId || !targetUserId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (action === 'follow') {
        await db.query(
          'INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, targetUserId]
        );
        return res.status(200).json({ success: true });
      } else if (action === 'unfollow') {
        await db.query(
          'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2',
          [userId, targetUserId]
        );
        return res.status(200).json({ success: true });
      }
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Error managing following:', error);
    return res.status(500).json({ error: 'Failed to manage following', message: error.message });
  }
};
