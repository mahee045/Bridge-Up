// server/db/users.js
const db = require("./index");
const { v4: uuidv4 } = require("uuid");

async function createUser({name, role, interests, bio }) {
  const result = await db.query(
    `INSERT INTO users (id, name, role, interests, bio)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [ uuidv4(), name, role, interests, bio]
  );
  return result.rows[0];
}

async function getUserById(id) {
  const result = await db.query(
    `SELECT * 
     FROM users
     WHERE id = $1`, 
    [id]
  );
  return result.rows[0];
  
}

async function getAllUsersByRole(role) {
  const result = await db.query(
    `SELECT * 
     FROM users
     WHERE role = $1`,
    [role]
  );

  return result.rows;
}

module.exports = { createUser, getUserById, getAllUsersByRole };