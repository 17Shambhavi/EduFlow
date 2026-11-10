import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      // full reload, taaki Navbar naya login turant dikhaye
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Try a different email."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-page {
          min-height: calc(100vh - 66px);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #e9edd5 0%, #f5f0e1 55%, #ebe0ca 100%);
        }
        .auth-box {
          width: 100%; max-width: 900px; display: grid; grid-template-columns: 1fr 1fr;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-lg);
        }
        .auth-side {
          background: linear-gradient(135deg, var(--olive), var(--olive-dark));
          color: #fff; padding: 48px 36px; display: flex; flex-direction: column; justify-content: center;
        }
        .auth-side h2 { color: #fff; font-size: 30px; margin: 0 0 12px; line-height: 1.2; text-align: left; }
        .auth-side p { margin: 0 0 24px; opacity: 0.88; line-height: 1.6; text-align: left; }
        .auth-points { list-style: none; margin: 0; padding: 0; text-align: left; }
        .auth-points li { padding: 6px 0; font-size: 15px; opacity: 0.95; }
        .auth-points li::before { content: "✓"; margin-right: 10px; font-weight: 700; }

        .auth-form { padding: 40px 40px; }
        .auth-form h1 { margin: 0 0 6px; font-size: 28px; font-weight: 800; text-align: left; }
        .auth-sub { margin: 0 0 22px; color: var(--muted); text-align: left; }

        .auth-field { margin-bottom: 16px; text-align: left; }
        .auth-field label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
        .auth-field input { width: 100%; font-size: 15px; padding: 12px 14px; }
        .auth-pass { position: relative; }
        .auth-pass input { padding-right: 64px; }
        .auth-toggle {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--olive-dark); font-size: 13px; font-weight: 600;
        }

        .role-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .role-card {
          text-align: left; background: #fff; border: 2px solid var(--border);
          border-radius: 12px; padding: 12px 14px; transition: all 0.2s;
        }
        .role-card:hover { border-color: var(--olive); }
        .role-card.active { border-color: var(--olive); background: var(--olive-light); }
        .role-card b { display: block; font-size: 15px; color: var(--text); }
        .role-card small { color: var(--muted); font-size: 12px; }

        .auth-error {
          background: #f8e4e0; color: var(--danger); border: 1px solid #e8c2ba;
          padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; text-align: left;
        }
        .auth-submit { width: 100%; padding: 13px; font-size: 15px; margin-top: 4px; }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-alt { margin: 20px 0 0; text-align: center; color: var(--muted); font-size: 14px; }
        .auth-alt a { font-weight: 700; text-decoration: none; }
        .auth-alt a:hover { text-decoration: underline; }

        @media (max-width: 760px) {
          .auth-box { grid-template-columns: 1fr; }
          .auth-side { display: none; }
          .auth-form { padding: 32px 22px; }
        }
      `}</style>

      <div className="auth-box">
        <div className="auth-side">
          <h2>Start your learning journey</h2>
          <p>Create a free account and join learners and instructors on EduFlow.</p>
          <ul className="auth-points">
            <li>Access courses anytime</li>
            <li>Take quizzes and track progress</li>
            <li>Earn certificates</li>
            <li>Teach and share your knowledge</li>
          </ul>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Create account</h1>
          <p className="auth-sub">It only takes a minute.</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-pass">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label>I want to join as</label>
            <div className="role-row">
              <button
                type="button"
                className={`role-card ${role === "STUDENT" ? "active" : ""}`}
                onClick={() => setRole("STUDENT")}
              >
                <b>Student</b>
                <small>Learn from courses</small>
              </button>
              <button
                type="button"
                className={`role-card ${role === "INSTRUCTOR" ? "active" : ""}`}
                onClick={() => setRole("INSTRUCTOR")}
              >
                <b>Instructor</b>
                <small>Create and teach</small>
              </button>
            </div>
          </div>

          <button className="btn auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="auth-alt">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;