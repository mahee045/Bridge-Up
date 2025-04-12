// server/db/users.js
const db = require("./index");

async function createUser({ id, name, role, interests, bio }) {
  const result = await db.query(
    `INSERT INTO users (id, name, role, interests, bio)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, name, role, interests, bio]
  );
  return result.rows[0];
}

module.exports = { createUser };