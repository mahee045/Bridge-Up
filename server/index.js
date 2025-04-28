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
const { addToMatchQueue, removeFromMatchQueue, getAllFromMatchQueueByRole } = require('./db/matchQueue');
app.use(express.json());


///ChatFUNCTION 

//1. creating the http server
const server = http.createServer(app);

//2.Initialize Socket.IO with the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", //confirm port matches frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 3. Listen for messages from the client
  socket.on("send_message", (data) => {
    // data can include: { room, sender, text }
    io.to(data.room).emit("receive_message", data); // Send message to everyone in the room
  });

  // 4. Join a chat room (identified by a room name, e.g., user1-user2)
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
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

    const user = await createUser({
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


//matching queue
app.get("/match", async (req, res) => {
  const { userId } = req.query;
  try {
    const currentUser = await getUserById(userId);
    const role = currentUser.role === "mentor" ? "mentee" : "mentor";
    const allUsers = await getAllFromMatchQueueByRole(role);

    // Now allUsers has .name and .interests!
    // ...your matching logic (filtering by interests etc)...
    const matches = allUsers.filter(user => {
      return user.interests.some(interest => currentUser.interests.includes(interest));
    });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


//find and create match
app.post("/match", async (req, res) => {
  console.log("MATCH QUEUE BODY:", req.body);
  try {
    const match = await findAndCreateMatch();
    // If a match is found, send details
    res.status(200).json({
      matched: true,
      session_id: match.session_id,
      mentor_id: match.mentor_id,
      mentee_id: match.mentee_id,
      session_link: match.session_link,
    });
  } catch (err) {
    // If NO match (e.g., "No compatible mentor available."), just say matched: false
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

/// Get Route User
app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//GET route for matching queue
app.get("/match-queue", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM match_queue ORDER BY joined_at ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch match queue" });
  }
});

//post route 
app.post("/match-queue", async (req, res) => {
  try {
    const { user_id, role, interests } = req.body;
    const matchEntry = await addToMatchQueue({ user_id, role, interests });
    res.status(201).json(matchEntry);
  } catch (err) {
    console.error("Error in /match-queue:", err);
    res.status(500).json({ error: "Failed to add to match queue" });
  }
});


//GET ROUTE for sessions
app.get("/sessions", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sessions ORDER BY started_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

server.listen(PORT, () => { //listener should be the last line in teh code
  console.log(`Server listening on port ${PORT}`);
});