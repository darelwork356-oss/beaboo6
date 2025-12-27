const db = require('../db');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = async (req, res) => {
  const { action } = req.query;

  try {
    // NOTES
    if (action === 'get-notes') {
      const { limit = 50, userId } = req.query;
      let query = `SELECT n.*, u.username, u.display_name, u.profile_image_url,
                   (SELECT COUNT(*) FROM note_likes WHERE note_id = n.id) as likes
                   FROM notes n LEFT JOIN users u ON n.user_id = u.id`;
      const params = [];
      if (userId) {
        query += ' WHERE n.user_id = $1';
        params.push(userId);
      }
      query += ' ORDER BY n.created_at DESC LIMIT $' + (params.length + 1);
      params.push(parseInt(limit));
      const result = await db.query(query, params);
      const notes = await Promise.all(result.rows.map(async (note) => {
        if (note.s3_key) {
          const command = new GetObjectCommand({
            Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
            Key: note.s3_key,
          });
          note.image_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }
        return note;
      }));
      return res.json({ notes });
    }

    if (action === 'upload-note') {
      const { content, userId, imageData, fileName, contentType } = req.body;
      if (!content || !userId) return res.status(400).json({ error: 'Missing fields' });
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let imageUrl = null, s3Key = null;
      if (imageData && fileName) {
        const buffer = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        s3Key = `notes/${userId}/${Date.now()}_${fileName}`;
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: contentType || 'image/jpeg',
        }));
        imageUrl = `https://${process.env.MY_AWS_S3_BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${s3Key}`;
      }
      const result = await db.query(
        `INSERT INTO notes (id, user_id, content, image_url, s3_key, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [noteId, userId, content, imageUrl, s3Key]
      );
      return res.json({ success: true, note: result.rows[0] });
    }

    if (action === 'delete-note') {
      const { noteId } = req.body;
      if (!noteId) return res.status(400).json({ error: 'Missing noteId' });
      const result = await db.query('SELECT * FROM notes WHERE id = $1', [noteId]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      if (result.rows[0].s3_key) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
          Key: result.rows[0].s3_key,
        }));
      }
      await db.query('DELETE FROM notes WHERE id = $1', [noteId]);
      return res.json({ success: true });
    }

    if (action === 'like-note') {
      const { noteId, userId } = req.body;
      if (!noteId || !userId) return res.status(400).json({ error: 'Missing fields' });
      const existing = await db.query('SELECT * FROM note_likes WHERE note_id = $1 AND user_id = $2', [noteId, userId]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Already liked' });
      await db.query('INSERT INTO note_likes (note_id, user_id) VALUES ($1, $2)', [noteId, userId]);
      const count = await db.query('SELECT COUNT(*) as likes FROM note_likes WHERE note_id = $1', [noteId]);
      return res.json({ success: true, likes: parseInt(count.rows[0].likes) });
    }

    // STORIES
    if (action === 'get-stories') {
      const { limit = 100, userId } = req.query;
      let query = `SELECT s.*, u.username, u.display_name, u.profile_image_url FROM stories s LEFT JOIN users u ON s.user_id = u.id WHERE 1=1`;
      const params = [];
      if (userId) {
        query += ' AND s.user_id = $1';
        params.push(userId);
      }
      query += ' ORDER BY s.created_at DESC LIMIT $' + (params.length + 1);
      params.push(parseInt(limit));
      const result = await db.query(query, params);
      const stories = await Promise.all(result.rows.map(async (story) => {
        if (story.s3_key) {
          const command = new GetObjectCommand({
            Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
            Key: story.s3_key,
          });
          story.cover_image_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }
        return story;
      }));
      return res.json({ stories });
    }

    if (action === 'upload-story') {
      const { title, category, rating, language, synopsis, userId, username, email, coverImageData, coverImageFileName, coverImageContentType } = req.body;
      if (!title || !userId) return res.status(400).json({ error: 'Missing fields' });
      const storyId = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let coverImageUrl = null, s3Key = null;
      if (coverImageData && coverImageFileName) {
        const buffer = Buffer.from(coverImageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        s3Key = `covers/${userId}/${storyId}_${coverImageFileName}`;
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: coverImageContentType || 'image/jpeg',
        }));
        coverImageUrl = `https://${process.env.MY_AWS_S3_BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${s3Key}`;
      }
      const result = await db.query(
        `INSERT INTO stories (id, user_id, username, email, title, category, rating, language, synopsis, cover_image_url, s3_key, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) RETURNING *`,
        [storyId, userId, username, email, title, category, rating, language, synopsis, coverImageUrl, s3Key]
      );
      return res.json({ success: true, story: result.rows[0] });
    }

    if (action === 'delete-story') {
      const { storyId } = req.body;
      if (!storyId) return res.status(400).json({ error: 'Missing storyId' });
      const result = await db.query('SELECT * FROM stories WHERE id = $1', [storyId]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      if (result.rows[0].s3_key) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
          Key: result.rows[0].s3_key,
        }));
      }
      const chapters = await db.query('SELECT * FROM chapters WHERE story_id = $1', [storyId]);
      for (const chapter of chapters.rows) {
        if (chapter.s3_key) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
            Key: chapter.s3_key,
          }));
        }
      }
      await db.query('DELETE FROM stories WHERE id = $1', [storyId]);
      return res.json({ success: true });
    }

    // CHAPTERS
    if (action === 'get-chapters') {
      const { storyId } = req.query;
      if (!storyId) return res.status(400).json({ error: 'Missing storyId' });
      const result = await db.query('SELECT * FROM chapters WHERE story_id = $1 ORDER BY chapter_number ASC', [storyId]);
      const chapters = await Promise.all(result.rows.map(async (chapter) => {
        if (chapter.s3_key) {
          const command = new GetObjectCommand({
            Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
            Key: chapter.s3_key,
          });
          chapter.image_url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }
        return chapter;
      }));
      return res.json({ chapters });
    }

    if (action === 'upload-chapter') {
      const { storyId, chapterNumber, title, content, userId, imageData, fileName, contentType } = req.body;
      if (!storyId || !chapterNumber || !content || !userId) return res.status(400).json({ error: 'Missing fields' });
      const chapterId = `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let imageUrl = null, s3Key = null;
      if (imageData && fileName) {
        const buffer = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        s3Key = `chapters/${storyId}/${chapterId}_${fileName}`;
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: contentType || 'image/jpeg',
        }));
        imageUrl = `https://${process.env.MY_AWS_S3_BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${s3Key}`;
      }
      const result = await db.query(
        `INSERT INTO chapters (id, story_id, user_id, title, content, chapter_number, image_url, s3_key, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
        [chapterId, storyId, userId, title, content, chapterNumber, imageUrl, s3Key]
      );
      return res.json({ success: true, chapter: result.rows[0] });
    }

    if (action === 'rate-chapter') {
      const { chapterId, userId, rating } = req.body;
      if (!chapterId || !userId || !rating) return res.status(400).json({ error: 'Missing fields' });
      if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating 1-5' });
      await db.query(
        `INSERT INTO chapter_ratings (chapter_id, user_id, rating) VALUES ($1, $2, $3) ON CONFLICT (chapter_id, user_id) DO UPDATE SET rating = $3, created_at = NOW()`,
        [chapterId, userId, rating]
      );
      const avg = await db.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM chapter_ratings WHERE chapter_id = $1', [chapterId]);
      return res.json({ success: true, avgRating: parseFloat(avg.rows[0].avg_rating).toFixed(2), totalRatings: parseInt(avg.rows[0].total) });
    }

    // USERS
    if (action === 'get-user-data') {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });
      const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json({ user: result.rows[0] });
    }

    if (action === 'update-user-profile') {
      const { userId, username, displayName, bio, profileImageUrl, email } = req.body;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });
      const existing = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      let result;
      if (existing.rows.length === 0) {
        result = await db.query(
          `INSERT INTO users (id, email, username, display_name, bio, profile_image_url, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
          [userId, email, username, displayName, bio, profileImageUrl]
        );
      } else {
        result = await db.query(
          `UPDATE users SET username = COALESCE($2, username), display_name = COALESCE($3, display_name), bio = COALESCE($4, bio), profile_image_url = COALESCE($5, profile_image_url), email = COALESCE($6, email), updated_at = NOW() WHERE id = $1 RETURNING *`,
          [userId, username, displayName, bio, profileImageUrl, email]
        );
      }
      return res.json({ success: true, user: result.rows[0] });
    }

    // FOLLOWING
    if (action === 'manage-following') {
      const { type, userId, targetUserId, followAction } = req.method === 'GET' ? req.query : req.body;
      if (req.method === 'GET') {
        if (!userId || !type) return res.status(400).json({ error: 'Missing fields' });
        if (type === 'following') {
          const result = await db.query('SELECT following_id, created_at FROM followers WHERE follower_id = $1', [userId]);
          return res.json({ following: result.rows });
        } else if (type === 'followers') {
          const result = await db.query('SELECT follower_id, created_at FROM followers WHERE following_id = $1', [userId]);
          return res.json({ followers: result.rows });
        }
      }
      if (!followAction || !userId || !targetUserId) return res.status(400).json({ error: 'Missing fields' });
      if (followAction === 'follow') {
        await db.query('INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, targetUserId]);
      } else if (followAction === 'unfollow') {
        await db.query('DELETE FROM followers WHERE follower_id = $1 AND following_id = $2', [userId, targetUserId]);
      }
      return res.json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
};
