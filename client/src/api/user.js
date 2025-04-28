// client/src/api/user.js

export const createUser = async (user) => {
  const res = await fetch("http://localhost:3001/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

export const addToMatchQueue = async (queueData) => {
  const res = await fetch("http://localhost:3001/match-queue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(queueData),
  });

  if (!res.ok) throw new Error("Failed to join match queue");
  return res.json();
};

export const removeFromMatchQueue = async (queueId) => {
  const res = await fetch(`http://localhost:3001/match-queue/${queueId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove from match queue");
  return res.json();
};
