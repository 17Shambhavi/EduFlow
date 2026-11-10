import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LEVELS = [
  { value: "BEGINNER", label: "Beginner", hint: "No experience needed" },
  { value: "INTERMEDIATE", label: "Intermediate", hint: "Some basics required" },
  { value: "ADVANCED", label: "Advanced", hint: "For experienced learners" },
];

const CATEGORY_IDEAS = [
  "Programming",
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Business",
  "Marketing",
];

function CreateCourse() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState(null); // { type: "ok" | "err", text }
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/courses",
        { title, description, category, level, price: Number(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "ok", text: "Course created successfully!" });
      setTimeout(() => navigate(`/courses/${res.data.id}`), 1000);
    } catch (err) {
      setMessage({
        type: "err",
        text: "Failed to create course. Are you logged in as an Instructor?",
      });
      setSaving(false);
    }
  };

  const priceNumber = Number(price);
  const previewPrice =
    price === "" ? "₹0" : priceNumber === 0 ? "Free" : `₹${priceNumber}`;

  return (
    <div className="cc-page">
      <style>{`
        .cc-page { max-width: 1100px; margin: 0 auto; padding: 36px 24px 60px; }
        .cc-head h1 { margin: 0 0 6px; font-size: 34px; font-weight: 800; letter-spacing: -0.5px; text-align: left; }
        .cc-head p { margin: 0 0 26px; color: var(--muted); text-align: left; }

        .cc-grid { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }

        .cc-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 28px; box-shadow: var(--shadow);
        }
        .cc-field { margin-bottom: 20px; text-align: left; }
        .cc-field label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
        .cc-field input, .cc-field textarea { width: 100%; font-size: 15px; padding: 12px 14px; }
        .cc-field textarea { min-height: 130px; resize: vertical; line-height: 1.6; }
        .cc-hint { font-size: 12px; color: var(--muted); margin-top: 6px; }
        .cc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .cc-levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .cc-level {
          text-align: left; background: #fff; border: 2px solid var(--border);
          border-radius: 12px; padding: 12px 14px; transition: all 0.2s;
        }
        .cc-level:hover { border-color: var(--olive); }
        .cc-level.active { border-color: var(--olive); background: var(--olive-light); }
        .cc-level b { display: block; font-size: 14px; color: var(--text); }
        .cc-level small { font-size: 12px; color: var(--muted); }

        .cc-price { position: relative; }
        .cc-price span {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-weight: 700; color: var(--olive-dark);
        }
        .cc-price input { padding-left: 34px; }

        .cc-msg { padding: 12px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; text-align: left; }
        .cc-msg.ok { background: #e6efd9; color: #3d6326; border: 1px solid #c9dbb3; }
        .cc-msg.err { background: #f8e4e0; color: var(--danger); border: 1px solid #e8c2ba; }

        .cc-submit { width: 100%; padding: 14px; font-size: 15px; }
        .cc-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Preview */
        .cc-side { position: sticky; top: 90px; }
        .cc-side-title { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; text-align: left; }
        .cc-prev {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden; box-shadow: var(--shadow);
        }
        .cc-prev-banner {
          height: 130px; background: linear-gradient(135deg, #6b7a3a, #4a5528);
          display: flex; align-items: center; justify-content: center; position: relative;
          color: rgba(255,255,255,0.92); font-size: 52px; font-weight: 800;
        }
        .cc-prev-cat {
          position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.92);
          color: var(--olive-dark); font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;
        }
        .cc-prev-body { padding: 16px 18px 18px; text-align: left; }
        .cc-prev-body h3 { margin: 0 0 6px; font-size: 18px; text-align: left; }
        .cc-prev-desc {
          margin: 0 0 14px; color: var(--muted); font-size: 14px; line-height: 1.55; min-height: 42px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .cc-prev-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 12px; border-top: 1px solid var(--border);
        }
        .cc-prev-level {
          font-size: 12px; font-weight: 600; color: var(--olive-dark);
          background: var(--olive-light); padding: 4px 10px; border-radius: 20px; text-transform: uppercase;
        }
        .cc-prev-price { font-size: 18px; font-weight: 800; color: var(--accent); }

        .cc-note {
          margin-top: 14px; padding: 12px 14px; font-size: 13px; line-height: 1.55; text-align: left;
          background: var(--olive-light); color: var(--olive-dark); border-radius: 10px;
        }

        .cc-block { text-align: center; padding: 70px 20px; }
        .cc-block h3 { margin: 0 0 6px; }
        .cc-block p { margin: 0 0 18px; color: var(--muted); }
        .cc-block .btn { display: inline-block; text-decoration: none; }

        @media (max-width: 900px) {
          .cc-grid { grid-template-columns: 1fr; }
          .cc-side { position: static; order: -1; }
        }
        @media (max-width: 560px) {
          .cc-row, .cc-levels { grid-template-columns: 1fr; }
          .cc-page { padding: 24px 16px 40px; }
        }
      `}</style>

      <div className="cc-head">
        <h1>Create a Course</h1>
        <p>Fill in the basics now. You can add sections and lessons right after.</p>
      </div>

      {!token && (
        <div className="cc-card cc-block">
          <h3>Please log in</h3>
          <p>You need to log in as an Instructor to create a course.</p>
          <Link to="/login" className="btn">Log in</Link>
        </div>
      )}

      {token && role !== "INSTRUCTOR" && (
        <div className="cc-card cc-block">
          <h3>Only instructors can create courses</h3>
          <p>Your account is registered as a {role ? role.toLowerCase() : "different role"}.</p>
          <Link to="/courses" className="btn">Browse Courses</Link>
        </div>
      )}

      {token && role === "INSTRUCTOR" && (
        <div className="cc-grid">
          <form className="cc-card" onSubmit={handleSubmit}>
            <div className="cc-field">
              <label>Course title</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Web Development"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="cc-field">
              <label>Description</label>
              <textarea
                placeholder="What will students learn in this course?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="cc-row">
              <div className="cc-field">
                <label>Category</label>
                <input
                  type="text"
                  list="cc-categories"
                  placeholder="e.g. Programming"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
                <datalist id="cc-categories">
                  {CATEGORY_IDEAS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="cc-field">
                <label>Price</label>
                <div className="cc-price">
                  <span>₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="cc-hint">Enter 0 to make the course free.</div>
              </div>
            </div>

            <div className="cc-field">
              <label>Level</label>
              <div className="cc-levels">
                {LEVELS.map((l) => (
                  <button
                    type="button"
                    key={l.value}
                    className={`cc-level ${level === l.value ? "active" : ""}`}
                    onClick={() => setLevel(l.value)}
                  >
                    <b>{l.label}</b>
                    <small>{l.hint}</small>
                  </button>
                ))}
              </div>
            </div>

            {message && <div className={`cc-msg ${message.type}`}>{message.text}</div>}

            <button className="btn cc-submit" type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Course"}
            </button>
          </form>

          {/* Live preview */}
          <aside className="cc-side">
            <div className="cc-side-title">Live preview</div>
            <div className="cc-prev">
              <div className="cc-prev-banner">
                {category && <span className="cc-prev-cat">{category}</span>}
                {(title || "?").charAt(0).toUpperCase()}
              </div>
              <div className="cc-prev-body">
                <h3>{title || "Your course title"}</h3>
                <p className="cc-prev-desc">
                  {description || "Your course description will appear here."}
                </p>
                <div className="cc-prev-foot">
                  <span className="cc-prev-level">{level}</span>
                  <span className="cc-prev-price">{previewPrice}</span>
                </div>
              </div>
            </div>
            <div className="cc-note">
              Students will see your course after an admin approves it.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CreateCourse;