import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MatchingLobby from "./components/MatchingLobby";
// client/src/components/MatchingLobby.jsx

function App() {
  const uuid = localStorage.getItem("bridgeup_uuid") || "test-uuid";
  const role = localStorage.getItem("bridgeup_role") || "mentee";
  const field = localStorage.getItem("bridgeup_field") || "frontend, react";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/lobby"
          element={
            <MatchingLobby
              uuid={uuid}
              role={role}
              field={field}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

