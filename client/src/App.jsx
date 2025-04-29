import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ProfileForm from "./pages/ProfileForm";
import MatchingLobby from "./pages/MatchingLobby";
import ChatPage from "./pages/ChatPage"; 
import Feedback from "./pages/Feedback";
import Session from "./pages/Session";
import Navbar from "./pages/NavBar";


// You can remove either Landing or Home if you only use one for "/"
function App() {
  
  const uuid = localStorage.getItem("bridgeup_uuid") || "test-uuid";
  const role = localStorage.getItem("bridgeup_role") || "mentee";
  const field = localStorage.getItem("bridgeup_field") || "frontend, react";

  return (
    <Router>
       <Navbar />
      <Routes>
        {/* You can use Landing or Home, or both depending on your preference */}
        <Route path="/" element={<Landing />} />
        <Route path="/profile-form" element={<ProfileForm />} />
        <Route path="/matching-lobby" element={<MatchingLobby uuid={uuid} role={role} field={field}/>}/>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/session" element={<Session />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}


export default App;
