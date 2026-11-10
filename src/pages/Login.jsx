import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name || data.fullName || "");
      localStorage.setItem("role", data.role || "");

      // full reload, taaki Navbar naya login turant dikhaye
      window.location.href = "/dashboard";
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401 || err.response?.status === 403
          ? "Incorrect email or password."
          : "Something went wrong. Please try again.");
      setError(msg);
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

        .auth-form { padding: 48px 40px; }
        .auth-form h1 { margin: 0 0 6px; font-size: 28px; font-weight: 800; text-align: left; }
        .auth-sub { margin: 0 0 26px; color: var(--muted); text-align: left; }

        .auth-field { margin-bottom: 18px; text-align: left; }
        .auth-field label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
        .auth-field input { width: 100%; font-size: 15px; padding: 12px 14px; }
        .auth-pass { position: relative; }
        .auth-pass input { padding-right: 64px; }
        .auth-toggle {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--olive-dark); font-size: 13px; font-weight: 600;
        }

        .auth-error {
          background: #f8e4e0; color: var(--danger); border: 1px solid #e8c2ba;
          padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; text-align: left;
        }
        .auth-submit { width: 100%; padding: 13px; font-size: 15px; margin-top: 4px; }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-alt { margin: 22px 0 0; text-align: center; color: var(--muted); font-size: 14px; }
        .auth-alt a { font-weight: 700; text-decoration: none; }
        .auth-alt a:hover { text-decoration: underline; }

        @media (max-width: 760px) {
          .auth-box { grid-template-columns: 1fr; }
          .auth-side { display: none; }
          .auth-form { padding: 36px 24px; }
        }
      `}</style>

      <div className="auth-box">
        <div className="auth-side">
          <h2>Welcome back to EduFlow</h2>
          <p>Log in to continue your courses, quizzes and certificates.</p>
          <ul className="auth-points">
            <li>Pick up right where you left off</li>
            <li>Track your learning progress</li>
            <li>Earn certificates</li>
          </ul>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <h1>Log in</h1>
          <p className="auth-sub">Enter your details to access your account.</p>

          {error && <div className="auth-error">{error}</div>}

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
                placeholder="Enter your password"
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

          <button className="btn auth-submit" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p className="auth-alt">
            New to EduFlow? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;