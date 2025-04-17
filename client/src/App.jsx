import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ProfileForm from "./pages/ProfileForm"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile-form" element={<ProfileForm />} />
        <Route path="/matching-lobby" element={<MatchingLobby />} />
      </Routes>
    </Router>
  );
}

export default App;
