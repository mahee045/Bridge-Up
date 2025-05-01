# 🌉 BridgeUp

BridgeUp is a real-time mentorship matching platform designed for instant, no-login-required mentorship experiences. Users select a role (mentor or mentee), briefly describe themselves, and get matched based on shared interests using a live matching queue and chat system.

## 🚀 Features

- 🔄 Instant mentor/mentee matching
- 🧠 Matching logic based on overlapping interests
- 💬 Real-time chat between paired users (Socket.IO)
- 📝 Feedback submission after each session
- 🗂️ Role-based matching lobby and queue management
- 📦 PostgreSQL backend with Express API

---

## 📦 Dependencies

### 🖥️ Client (Frontend)

| Package               | Version     | Description                        |
|----------------------|-------------|------------------------------------|
| `react`              | ^19.0.0     | Frontend library                   |
| `react-dom`          | ^19.0.0     | DOM rendering for React            |
| `react-router-dom`   | ^6.30.0     | Routing system                     |
| `react-select`       | ^5.10.1     | Multi-select dropdowns             |
| `socket.io-client`   | ^4.8.1      | WebSocket client for real-time chat |
| `uuid`               | ^11.1.0     | Generates unique user/session IDs  |

### 🌐 Server (Backend)

| Package     | Version    | Description                           |
|-------------|------------|---------------------------------------|
| `express`   | ^5.1.0     | Web framework for Node.js             |
| `pg`        | ^8.14.1    | PostgreSQL client for Node.js         |
| `cors`      | ^2.8.5     | Cross-Origin Resource Sharing         |
| `dotenv`    | ^16.5.0    | Environment variable loader           |
| `socket.io` | ^4.8.1     | WebSocket communication server-side   |
| `uuid`      | ^11.1.0    | For generating unique IDs             |

### ⚙️ Dev Tools

| Package              | Version     | Purpose                           |
|---------------------|-------------|-----------------------------------|
| `vite`              | ^6.3.1      | Lightning-fast frontend bundler  |
| `eslint`            | ^9.22.0     | Linting for JavaScript/React     |
| `sass`              | ^1.87.0     | CSS preprocessor for styling     |
| `@vitejs/plugin-react` | ^4.3.4  | React support for Vite            |
| `@types/react`      | ^19.0.10    | TypeScript types for React        |

---

## 🛠️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/Bridge-Up.git
cd Bridge-Up

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install

# 4. Create environment variables
# In the /server folder, create a .env file with the following:
# (You can do this with a command or by manually creating the file)
echo "PORT=3001" >> ../server/.env
echo "DATABASE_URL=postgres://labber:@localhost:5432/bridgeup" >> ../server/.env

# 5. Start the development servers

# In one terminal tab, start the backend:
cd ../server
npm run dev

# In another terminal tab, start the frontend:
cd ../client
npm run dev