const db = require("./index");

async function getSessionDetails(sessionId) {
  const result = await db.query(
    `SELECT 
       s.id AS session_id,
       s.session_link,
       s.started_at,
       s.ended_at,
       mentor.name AS mentor_name,
       mentor.bio AS mentor_bio,
       mentor.interests AS mentor_interests,
       mentee.name AS mentee_name,
       mentee.bio AS mentee_bio,
       mentee.interests AS mentee_interests
     FROM sessions s
     JOIN users mentor ON s.mentor_id = mentor.id
     JOIN users mentee ON s.mentee_id = mentee.id
     WHERE s.id = $1`,
    [sessionId]
  );

  return result.rows[0];
}

module.exports = { getSessionDetails };