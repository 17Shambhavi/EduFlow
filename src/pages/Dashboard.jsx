import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Welcome, {name}!</h2>
      <p>Role: {role}</p>
      <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;