import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/courses/public/${id}`)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    setMessage("");
    try {
      await axios.post(
        `http://localhost:8080/api/enrollments/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setMessage("You are enrolled! You can start learning now.");
    } catch (err) {
      setSuccess(false);
      setMessage("Enrollment failed. You may already be enrolled.");
    }
    setEnrolling(false);
  };

  if (loading) {
    return (
      <div className="cd-center">
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="cd-center">
        <h3>Course not found</h3>
        <p>This course may have been removed or is not approved yet.</p>
        <Link to="/courses" className="btn" style={{ textDecoration: "none" }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  const isFree = !course.price || Number(course.price) === 0;
  const instructorName = course.instructor?.name || "Instructor";

  return (
    <div className="cd-page">
      <style>{`
        .cd-center { text-align: center; padding: 80px 20px; color: var(--muted); }
        .cd-center h3 { color: var(--text); margin: 0 0 6px; }
        .cd-center .btn { display: inline-block; margin-top: 12px; }

        .cd-hero {
          background: linear-gradient(135deg, var(--olive), var(--olive-dark));
          color: #fff; padding: 48px 0 90px;
        }
        .cd-wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .cd-back { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 14px; font-weight: 600; }
        .cd-back:hover { color: #fff; text-decoration: underline; }
        .cd-badges { display: flex; gap: 10px; flex-wrap: wrap; margin: 18px 0 14px; }
        .cd-badge {
          background: rgba(255,255,255,0.18); padding: 4px 12px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
        }
        .cd-hero h1 {
          margin: 0 0 12px; font-size: clamp(28px, 4vw, 42px); font-weight: 800;
          letter-spacing: -0.8px; color: #fff; text-align: left; max-width: 640px;
        }
        .cd-short { margin: 0 0 18px; opacity: 0.9; max-width: 600px; line-height: 1.6; text-align: left; }
        .cd-by { display: flex; align-items: center; gap: 10px; font-size: 14px; }
        .cd-by-av {
          width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.5); display: flex; align-items: center;
          justify-content: center; font-weight: 700;
        }

        .cd-body {
          max-width: 1100px; margin: -56px auto 0; padding: 0 24px 60px;
          display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start;
        }

        .cd-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 26px; box-shadow: var(--shadow);
        }
        .cd-main { margin-top: 56px; display: flex; flex-direction: column; gap: 22px; }
        .cd-card h2 { margin: 0 0 12px; font-size: 20px; font-weight: 800; text-align: left; }
        .cd-desc { margin: 0; color: var(--muted); line-height: 1.75; font-size: 15px; text-align: left; white-space: pre-line; }

        .cd-incl { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .cd-incl li { display: flex; align-items: center; gap: 10px; font-size: 15px; text-align: left; }
        .cd-tick {
          width: 22px; height: 22px; border-radius: 50%; background: var(--olive-light);
          color: var(--olive-dark); display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; flex-shrink: 0;
        }

        .cd-side { position: sticky; top: 90px; }
        .cd-banner {
          height: 150px; border-radius: 12px; margin-bottom: 18px;
          background: linear-gradient(135deg, #9aa95a, var(--olive));
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.92); font-size: 60px; font-weight: 800;
        }
        .cd-price { font-size: 32px; font-weight: 800; color: var(--accent); margin-bottom: 16px; text-align: left; }
        .cd-price.free { color: var(--success); }

        .cd-btn {
          display: block; width: 100%; text-align: center; text-decoration: none;
          padding: 13px; border-radius: 10px; font-size: 15px; font-weight: 700;
          margin-bottom: 10px; transition: all 0.2s; border: 1px solid var(--olive);
        }
        .cd-btn.solid { background: var(--olive); color: #fff; }
        .cd-btn.solid:hover:not(:disabled) { background: var(--olive-dark); }
        .cd-btn.ghost { background: transparent; color: var(--olive-dark); }
        .cd-btn.ghost:hover { background: var(--olive-light); }
        .cd-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cd-msg { padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 12px; text-align: left; }
        .cd-msg.ok { background: #e6efd9; color: #3d6326; border: 1px solid #c9dbb3; }
        .cd-msg.err { background: #f8e4e0; color: var(--danger); border: 1px solid #e8c2ba; }

        .cd-meta { margin-top: 8px; padding-top: 16px; border-top: 1px solid var(--border); }
        .cd-meta div { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; }
        .cd-meta span:first-child { color: var(--muted); }
        .cd-meta span:last-child { font-weight: 600; }

        @media (max-width: 900px) {
          .cd-body { grid-template-columns: 1fr; margin-top: -40px; }
          .cd-side { position: static; order: -1; }
          .cd-main { margin-top: 0; }
          .cd-incl { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO */}
      <section className="cd-hero">
        <div className="cd-wrap">
          <Link to="/courses" className="cd-back">← Back to courses</Link>
          <div className="cd-badges">
            {course.category && <span className="cd-badge">{course.category}</span>}
            {course.level && <span className="cd-badge">{course.level}</span>}
          </div>
          <h1>{course.title}</h1>
          <div className="cd-by">
            <div className="cd-by-av">{instructorName.charAt(0).toUpperCase()}</div>
            <span>Created by {instructorName}</span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="cd-body">
        <div className="cd-main">
          <div className="cd-card">
            <h2>About this course</h2>
            <p className="cd-desc">{course.description || "No description added yet."}</p>
          </div>

          <div className="cd-card">
            <h2>This course includes</h2>
            <ul className="cd-incl">
              <li><span className="cd-tick">✓</span> Lessons you can watch anytime</li>
              <li><span className="cd-tick">✓</span> Learn at your own pace</li>
              <li><span className="cd-tick">✓</span> Quizzes to test yourself</li>
              <li><span className="cd-tick">✓</span> Certificate on completion</li>
            </ul>
          </div>
        </div>

        {/* ENROLL CARD */}
        <aside className="cd-side">
          <div className="cd-card">
            <div className="cd-banner">{(course.title || "?").charAt(0).toUpperCase()}</div>
            <div className={`cd-price ${isFree ? "free" : ""}`}>
              {isFree ? "Free" : `₹${course.price}`}
            </div>

            {message && (
              <div className={`cd-msg ${success ? "ok" : "err"}`}>{message}</div>
            )}

            <button className="cd-btn solid" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>

            <Link to={`/learn/${course.id}`} className="cd-btn ghost">
              Go to Course
            </Link>

            {role === "INSTRUCTOR" && (
              <Link to={`/manage-content/${course.id}`} className="cd-btn ghost">
                Manage Content
              </Link>
            )}

            <div className="cd-meta">
              {course.category && (
                <div><span>Category</span><span>{course.category}</span></div>
              )}
              {course.level && (
                <div><span>Level</span><span>{course.level}</span></div>
              )}
              <div><span>Instructor</span><span>{instructorName}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CourseDetail;