// server/db/match.js

const db = require("./index"); 
const { v4: uuidv4 } = require("uuid");

// Find the mentee and the mentor with the most shared interests
async function findAndCreateMatch() {
  const client = await db.connect();///should not be there
  try {
    await client.query("BEGIN");

    // 1. Find the oldest mentee
    const menteeResult = await client.query(
      `SELECT * FROM match_queue WHERE role = 'mentee' ORDER BY joined_at ASC LIMIT 1`
    );
    if (menteeResult.rows.length === 0) throw new Error("No mentees waiting.");

    const mentee = menteeResult.rows[0];

    // 2. Find all mentors
    const mentorsResult = await client.query(
      `SELECT * FROM match_queue WHERE role = 'mentor'`
    );
    if (mentorsResult.rows.length === 0) throw new Error("No mentors waiting.");

    // 3. Calculate overlap for each mentor
    let bestMentor = null;
    let maxOverlap = 0;

    for (const mentor of mentorsResult.rows) {
      // interests are arrays: calculate overlap count
      const mentorInterests = mentor.interests;
      const menteeInterests = mentee.interests;
      // count shared interests
      const overlap = mentorInterests.filter(i => menteeInterests.includes(i)).length;

      if (overlap > maxOverlap) {
        bestMentor = mentor;
        maxOverlap = overlap;
      } else if (overlap === maxOverlap && bestMentor && mentor.joined_at < bestMentor.joined_at) {
        // tiebreaker: earliest joined mentor
        bestMentor = mentor;
      }
    }

    if (!bestMentor || maxOverlap === 0) throw new Error("No compatible mentor available.");

    // 4. Create session
    const sessionId = uuidv4();
    const sessionLink = `/session/${sessionId}`;
    await client.query(
      `INSERT INTO sessions (id, mentor_id, mentee_id, session_link)
       VALUES ($1, $2, $3, $4)`,
      [sessionId, bestMentor.user_id, mentee.user_id, sessionLink]
    );

    // 5. Remove both from queue
    await client.query(
      `DELETE FROM match_queue WHERE id = $1 OR id = $2`,
      [mentee.id, bestMentor.id]
    );

    await client.query("COMMIT");

    return {
      matched: true,
      session_id: sessionId,
      session_link: sessionLink,
      mentor_id: bestMentor.user_id,
      mentee_id: mentee.user_id,
      overlap: maxOverlap,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { findAndCreateMatch };