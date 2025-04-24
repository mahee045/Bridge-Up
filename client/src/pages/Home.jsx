import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("bridgeup_uuid", crypto.randomUUID());
    localStorage.setItem("bridgeup_role", "mentee");
    localStorage.setItem("bridgeup_field", "frontend, react");
    navigate("/lobby");
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to BridgeUp</h1>
      <p>Instant mentorship — no login required.</p>
      <button onClick={handleStart}>Enter as Mentee</button>
    </div>
  );
}
