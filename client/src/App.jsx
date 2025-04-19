import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ProfileForm from "./pages/ProfileForm"; 
import Session from "./pages/session";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/session" element={<Session />} />
        <Route path="/profile-form" element={<ProfileForm />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;
