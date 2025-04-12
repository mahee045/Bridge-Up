require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

const { v4: uuidv4 } = require("uuid"); // For generating unique user IDs

const db = require("./db");
const { createUser } = require("./db/users"); 
const { findAndCreateMatch } = require("./db/match");
const { getSessionDetails } = require("./db/sessions");
const { submitFeedback } = require("./db/feedback");
const { addToMatchQueue, removeFromMatchQueue } = require("./db/matchQueue");
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("BridgeUp backend is running!");
});

// Test DB connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

// Create a new user (mentor or mentee)
app.post("/users", async (req, res) => {
  try {
    const { name, role, interests, bio } = req.body;

    const user = await createUser({
      id: uuidv4(),
      name,
      role,
      interests,
      bio,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//matching queue
app.post("/match-queue", async (req, res) => {
  try {
    const { user_id, role, interests } = req.body;

    const matchEntry = await addToMatchQueue({ user_id, role, interests });

    res.status(201).json(matchEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to match queue" });
  }
});

//find and create match
app.post("/match", async (req, res) => {
  try {
    const match = await findAndCreateMatch();
    res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
});

//route for session
app.get("/session/:id", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await getSessionDetails(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
});

//feedback route
app.post("/feedback", async (req, res) => {
  try {
    const { session_id, from_user_id, message, rating } = req.body;

    if (!session_id || !from_user_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const feedback = await submitFeedback({ session_id, from_user_id, message, rating });

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

//DELETE user if they have left the matching lobby 
app.delete("/match-queue/:id", async (req, res) => {
  try {
    const queueId = req.params.id;
    const removed = await removeFromMatchQueue(queueId);

    if (!removed) {
      return res.status(404).json({ error: "Queue entry not found" });
    }

    res.json({ success: true, removed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from match queue" });
  }
});