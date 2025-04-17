import React, { useState } from "react";
import { createUser, addToMatchQueue } from "../api/user";
import { useNavigate } from "react-router-dom";

///add word count, add drop down for interests, add potential social media handle coloum
function ProfileForm() {

  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();


  const handleSubmit = () => {
    const role = localStorage.getItem("userRole");
  
    if (!name.trim() || !interests.trim() || !bio.trim()) {
      alert("Please fill out all fields before submitting.");
      return;
    }
  
    const interestsArray = interests.split(",").map((i) => i.trim());
  
    createUser({
      name,
      role,
      interests: interestsArray,
      bio
    })
      .then((createdUser) => {
        console.log("✅ User inserted into DB:", createdUser);
  
        return addToMatchQueue({
          user_id: createdUser.id, // ✅ Now it exists!
          role,
          interests: interestsArray,
        });
      })
      .then(() => {
        alert("Submitted successfully!");
        // Optionally navigate to matching lobby here
      })
      .catch((err) => {
        console.error("❌ Something went wrong:", err);
        alert("Something went wrong.");
      });

      navigate("/matching-lobby"); //naviagete to the matching lobby
  };

  return (
    <div>
      <h2> Tell us a bit about yourself </h2>
      <div>
  <label>Name</label>
  <input
    type="text"
    placeholder="Enter your name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>

<div>
  <label>Interests</label>
  <input
    type="text"
    placeholder="Enter your interests"
    value={interests}
    onChange={(e) => setInterests(e.target.value)}
  />
</div>

<div>
  <label>Bio</label>
  <input
    type="text"
    placeholder="Enter a short bio and social media handles!"
    value={bio}
    onChange={(e) => setBio(e.target.value)}
  />
</div>
<button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default ProfileForm;