// server/db/matchQueue.js
const db = require("./index");

// Add user to match queue
async function addToMatchQueue({ user_id, role, interests, bio }) {
  const result = await db.query(
    `INSERT INTO match_queue (user_id, role, interests, bio)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, 
    [user_id, role, interests, bio]
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
// Get all users in match_queue with a certain role

async function getAllFromMatchQueueByRole(role) {
  const result = await db.query(`
    SELECT 
      match_queue.id AS queue_id,
      users.id AS user_id,
      users.name,
      users.interests,
      users.role,
      match_queue.bio
    FROM match_queue
    JOIN users ON users.id = match_queue.user_id
    WHERE match_queue.role = $1
  `, [role]);
  return result.rows;
}


module.exports = {
  addToMatchQueue,
  removeFromMatchQueue,
  getAllFromMatchQueueByRole,
};

