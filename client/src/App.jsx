import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ProfileForm from "./pages/ProfileForm";
import Home from "./pages/Home"; // If you have a separate Home, otherwise use Landing.
import MatchingLobby from "./pages/MatchingLobby";

// You can remove either Landing or Home if you only use one for "/"
function App() {
  
  const uuid = localStorage.getItem("bridgeup_uuid") || "test-uuid";
  const role = localStorage.getItem("bridgeup_role") || "mentee";
  const field = localStorage.getItem("bridgeup_field") || "frontend, react";

  return (
    <Router>
      <Routes>
        {/* You can use Landing or Home, or both depending on your preference */}
        <Route path="/" element={<Landing />} />
        <Route path="/profile-form" element={<ProfileForm />} />
        <Route
          path="/matching-lobby" element={<MatchingLobby uuid={uuid} role={role} field={field}/>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
