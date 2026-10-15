import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // dropdown ke bahar click karne par band ho jaye
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setDropOpen(false);
  };

  return (
    <>
      <style>{`
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          height: 66px; padding: 0 28px;
          background: rgba(251, 248, 239, 0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }
        .nav-brand {
          font-size: 24px; font-weight: 800; text-decoration: none;
          color: var(--olive-dark); margin-right: 28px; letter-spacing: -0.5px;
        }
        .nav-brand span { color: var(--accent); }
        .nav-left, .nav-right { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          text-decoration: none; color: var(--muted); font-size: 15px;
          font-weight: 500; padding: 8px 14px; border-radius: 8px;
          transition: all 0.2s;
        }
        .nav-link:hover { color: var(--olive-dark); background: var(--card-hover); }
        .nav-link.active { color: var(--olive-dark); background: var(--olive-light); font-weight: 600; }

        .nav-user { position: relative; }
        .nav-user-btn {
          display: flex; align-items: center; gap: 10px;
          background: var(--card); border: 1px solid var(--border);
          padding: 5px 12px 5px 5px; border-radius: 40px;
          transition: box-shadow 0.2s;
        }
        .nav-user-btn:hover { box-shadow: var(--shadow); }
        .nav-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, var(--olive), var(--olive-dark));
          color: #fff; font-weight: 700; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-uname { font-size: 14px; font-weight: 600; color: var(--text); }
        .nav-caret { font-size: 10px; color: var(--muted); }

        .nav-drop {
          position: absolute; right: 0; top: 50px; min-width: 210px;
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); box-shadow: var(--shadow-lg);
          padding: 8px; animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-drop-head { padding: 10px 12px; border-bottom: 1px solid var(--border); margin-bottom: 6px; }
        .nav-drop-head b { display: block; font-size: 14px; color: var(--text); }
        .nav-drop-head small { color: var(--muted); text-transform: capitalize; }
        .nav-drop a, .nav-drop button {
          display: block; width: 100%; text-align: left; text-decoration: none;
          padding: 9px 12px; border-radius: 8px; border: none; background: none;
          font-size: 14px; color: var(--text);
        }
        .nav-drop a:hover, .nav-drop button:hover { background: var(--card-hover); }
        .nav-drop .logout { color: var(--danger); font-weight: 600; }

        .nav-signup {
          text-decoration: none; background: var(--olive); color: #fff;
          padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
          margin-left: 6px; transition: background 0.2s;
        }
        .nav-signup:hover { background: var(--olive-dark); }

        .nav-burger {
          display: none; background: none; border: 1px solid var(--border);
          border-radius: 8px; font-size: 20px; padding: 4px 10px; color: var(--olive-dark);
        }

        @media (max-width: 860px) {
          .nav { padding: 0 14px; }
          .nav-burger { display: block; }
          .nav-left {
            display: none; position: absolute; top: 66px; left: 0; right: 0;
            flex-direction: column; align-items: stretch; gap: 2px;
            background: var(--card); padding: 12px 14px;
            border-bottom: 1px solid var(--border); box-shadow: var(--shadow-lg);
          }
          .nav-left.open { display: flex; }
          .nav-brand { margin-right: 0; }
          .nav-uname, .nav-caret { display: none; }
          .nav-user-btn { padding: 5px; }
        }
      `}</style>

      <nav className="nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="nav-brand" onClick={closeAll}>
            Edu<span>Flow</span>
          </Link>
          <div className={`nav-left ${menuOpen ? "open" : ""}`}>
            <NavLink to="/courses" className="nav-link" onClick={closeAll}>
              Courses
            </NavLink>
            {token && (
              <NavLink to="/dashboard" className="nav-link" onClick={closeAll}>
                Dashboard
              </NavLink>
            )}
            {token && (
              <NavLink to="/my-enrollments" className="nav-link" onClick={closeAll}>
                My Enrollments
              </NavLink>
            )}
            {role === "INSTRUCTOR" && (
              <NavLink to="/create-course" className="nav-link" onClick={closeAll}>
                Create Course
              </NavLink>
            )}
            {role === "INSTRUCTOR" && (
              <NavLink to="/my-courses" className="nav-link" onClick={closeAll}>
                My Courses
              </NavLink>
            )}
          </div>
        </div>

        <div className="nav-right">
          {token ? (
            <div className="nav-user" ref={dropRef}>
              <button className="nav-user-btn" onClick={() => setDropOpen(!dropOpen)}>
                <div className="nav-avatar">{initial}</div>
                <span className="nav-uname">{name}</span>
                <span className="nav-caret">▼</span>
              </button>

              {dropOpen && (
                <div className="nav-drop">
                  <div className="nav-drop-head">
                    <b>{name}</b>
                    <small>{role ? role.toLowerCase() : ""}</small>
                  </div>
                  <Link to="/dashboard" onClick={closeAll}>Dashboard</Link>
                  <Link to="/my-enrollments" onClick={closeAll}>My Enrollments</Link>
                  <button className="logout" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <Link to="/signup" className="nav-signup">Signup</Link>
            </>
          )}
          <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;