// server/db/match.js

const db = require("./index");
const { v4: uuidv4 } = require("uuid");

// Match one mentor and one mentee based on shared interests and waiting order
async function findAndCreateMatch() {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1. Find the oldest mentee waiting in the queue
    const menteeResult = await client.query(
      `SELECT * FROM match_queue WHERE role = 'mentee' ORDER BY joined_at ASC LIMIT 1`
    );

    if (menteeResult.rows.length === 0) {
      throw new Error("No mentees available.");
    }

    const mentee = menteeResult.rows[0];

    // 2. Find the oldest mentor with overlapping interests
    const mentorResult = await client.query(
      `SELECT * FROM match_queue
       WHERE role = 'mentor'
       AND interests && $1
       ORDER BY joined_at ASC
       LIMIT 1`,
      [mentee.interests]
    );

    if (mentorResult.rows.length === 0) {
      throw new Error("No compatible mentor available.");
    }

    const mentor = mentorResult.rows[0];

    // 3. Create a new session
    const sessionId = uuidv4();
    const sessionLink = `/session/${sessionId}`;

    await client.query(
      `INSERT INTO sessions (id, mentor_id, mentee_id, session_link)
       VALUES ($1, $2, $3, $4)`,
      [sessionId, mentor.user_id, mentee.user_id, sessionLink]
    );

    // 4. Remove both from the match_queue
    await client.query(
      `DELETE FROM match_queue WHERE id = $1 OR id = $2`,
      [mentee.id, mentor.id]
    );

    await client.query("COMMIT");

    return {
      session_id: sessionId,
      session_link: sessionLink,
      mentor_id: mentor.user_id,
      mentee_id: mentee.user_id
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { findAndCreateMatch };
