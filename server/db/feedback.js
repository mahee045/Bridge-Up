const db = require("./index");

async function submitFeedback({ session_id, from_user_id, message, rating }) {
  const result = await db.query(
    `INSERT INTO feedback (session_id, from_user_id, message, rating)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [session_id, from_user_id, message, rating]
  );
  return result.rows[0];
}

module.exports = { submitFeedback };