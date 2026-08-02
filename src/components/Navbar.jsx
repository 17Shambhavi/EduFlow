import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid #444",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/courses">Courses</Link>
        {token && <Link to="/dashboard">Dashboard</Link>}
        {token && <Link to="/my-enrollments">My Enrollments</Link>}
        {role === "INSTRUCTOR" && <Link to="/create-course">Create Course</Link>}
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {token ? (
          <>
            <span>Hi, {name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;