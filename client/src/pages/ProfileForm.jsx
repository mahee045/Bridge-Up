import React, { useState } from "react";
import { createUser } from "../api/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ProfileForm.scss"; 

const INTEREST_OPTIONS = [
  "Music/Singing",
  "Writing/Blogging",
  "Drawing/Painting",
  "Photography",
  "Acting/Theater",
  "Programming/Coding",
  "Math/Logic Puzzles",
  "Robotics",
  "Science/Research",
  "Data Science/AI",
  "Public Speaking",
  "Volunteering/Community",
  "Leadership/Student Council",
  "Debate",
  "Reading/Book Clubs",
  "Language Learning",
  "Sports (General)",
  "Hiking/Outdoors",
  "Cooking/Baking",
  "Entrepreneurship/Startups",
];

function ProfileForm() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();
  const role = searchParams.get("role");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || selectedInterests.length === 0 || !bio.trim()) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    createUser({
      name,
      role,
      interests: selectedInterests,
      bio,
    })
      .then((createdUser) => {
        console.log("✅ User inserted into DB:", createdUser);
        alert("Submitted successfully!");
        navigate(`/matching-lobby?userId=${createdUser.id}`);
      })
      .catch((err) => {
        console.error("❌ Something went wrong:", err);
        alert("Something went wrong.");
      });
  };

  return (
    <div>
      <h2>Tell us a bit about yourself {role}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Interests (select one or more):</label>
          <select
            multiple
            value={selectedInterests}
            onChange={(e) =>
              setSelectedInterests(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            required
          >
            {INTEREST_OPTIONS.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
          <div>
            <strong>You selected:</strong>{" "}
            {selectedInterests.length > 0 ? (
              <ul>
                {selectedInterests.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            ) : (
              "None yet"
            )}
          </div>
        </div>

        <div>
          <label>Bio</label>
          <input
            type="text"
            placeholder="Enter a short bio and social media handles!"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ProfileForm;
