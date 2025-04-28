require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
app.use(cors());
const http = require("http");
const { Server } = require("socket.io");
const db = require("./db");
const { createUser, getUserById, getAllUsersByRole } = require("./db/users"); 
const { findAndCreateMatch } = require("./db/match");
const { getSessionDetails } = require("./db/sessions");
const { submitFeedback } = require("./db/feedback");
const { addToMatchQueue, removeFromMatchQueue, getAllFromMatchQueueByRole } = require("./db/matchQueue");
app.use(express.json());

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Confirm port matches frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    socket.room = room;  // 🛠 Save the room name for later
    console.log(`User joined room: ${room}`);
    
    // Notify others a user joined
    socket.to(room).emit("receive_message", { text: "A user has joined the chat!", system: true });
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // 🔥 Use the saved room when user disconnects
    if (socket.room) {
      socket.to(socket.room).emit("receive_message", { text: "A user has left the chat!", system: true });
    }
  });
});

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
    const user = await createUser({ name, role, interests, bio });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Add user to matching queue
app.post("/match-queue", async (req, res) => {
  try {
    const { user_id, role, interests } = req.body;
    console.log("Attempting to insert to match_queue with:", { user_id, role, interests });
    const matchEntry = await addToMatchQueue({ user_id, role, interests });
    res.status(201).json(matchEntry);
  } catch (err) {
    console.error("Error in /match-queue:", err);
    res.status(500).json({ error: "Failed to add to match queue" });
  }
});

// Find matches
app.get("/match", async (req, res) => {
  const { userId } = req.query;
  try {
    const currentUser = await getUserById(userId);
    const role = currentUser.role === "mentor" ? "mentee" : "mentor";
    const allUsers = await getAllFromMatchQueueByRole(role);
    const matches = allUsers.filter(user =>
      user.interests.some(interest => currentUser.interests.includes(interest))
    );
    res.json(matches);
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});

// Find and create a match session
app.post("/match", async (req, res) => {
  try {
    const match = await findAndCreateMatch();
    res.status(200).json({
      matched: true,
      session_id: match.session_id,
      mentor_id: match.mentor_id,
      mentee_id: match.mentee_id,
      session_link: match.session_link,
    });
  } catch (err) {
    if (
      err.message &&
      (err.message.includes("No mentees available") ||
        err.message.includes("No compatible mentor available"))
    ) {
      res.status(200).json({ matched: false });
    } else {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
});

// Get session details
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

// Submit feedback
app.post("/feedback", async (req, res) => {
  try {
    const { from_user_id, partner_user_id, message, rating } = req.body;

    if (!from_user_id || !partner_user_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const feedback = await submitFeedback({ from_user_id, partner_user_id, message, rating });

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});


// Delete from match queue
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

// Get all users
app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get all match queue entries
app.get("/match-queue", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM match_queue ORDER BY joined_at ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch match queue" });
  }
});

// Get all sessions
app.get("/sessions", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sessions ORDER BY started_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
