// server/db/matchQueue.js
const db = require("./index");

// Add user to match queue
async function addToMatchQueue({ user_id, role, interests }) {
  const result = await db.query(
    `INSERT INTO match_queue (user_id, role, interests)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, role, interests]
  );
  return result.rows[0];
}

// Remove user from match queue by row ID (not user ID)
async function removeFromMatchQueue(id) {
  const result = await db.query(
    `DELETE FROM match_queue WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}


module.exports = {
  addToMatchQueue,
  removeFromMatchQueue
};

