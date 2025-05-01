-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT,
  role TEXT CHECK (role IN ('mentor', 'mentee')),
  interests TEXT [],
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- match_queue  COME BACK TO THIS AND FIX INTERESTS TEXT[] SO THAT IT MATCHES ON SIMILARITY
CREATE TABLE IF NOT EXISTS match_queue (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role TEXT CHECK (role IN ('mentor', 'mentee')),
  interests TEXT [],
  bio TEXT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  mentor_id UUID REFERENCES users(id),
  mentee_id UUID REFERENCES users(id),
  session_link TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  notes TEXT
);
-- feedback
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  from_user_id UUID REFERENCES users(id),
  message TEXT,
  rating INTEGER CHECK (
    rating BETWEEN 1 AND 5
  ),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);