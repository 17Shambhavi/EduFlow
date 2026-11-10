import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BANNERS = [
  "linear-gradient(135deg, #6b7a3a, #4a5528)",
  "linear-gradient(135deg, #8a6a45, #5f4529)",
  "linear-gradient(135deg, #9aa95a, #6b7a3a)",
  "linear-gradient(135deg, #a88b64, #8a6a45)",
  "linear-gradient(135deg, #556b2f, #3b4a1f)",
];

function MyCourses() {
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:8080/api/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(Array.isArray(res.data) ? res.data : res.data.content || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [token]);

  const statusOf = (c) => String(c.status || "").toUpperCase();
  const totalEnrollments = courses.reduce(
    (sum, c) => sum + (Number(c.totalEnrollments) || 0),
    0
  );
  const approved = courses.filter((c) => statusOf(c) === "APPROVED").length;
  const pending = courses.filter((c) => statusOf(c) === "PENDING").length;

  return (
    <div className="mc-page">
      <style>{`
        .mc-page { max-width: 1100px; margin: 0 auto; padding: 36px 24px 60px; }
        .mc-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 26px; }
        .mc-head h1 { margin: 0 0 6px; font-size: 34px; font-weight: 800; letter-spacing: -0.5px; text-align: left; }
        .mc-head p { margin: 0; color: var(--muted); text-align: left; }
        .mc-head .btn { text-decoration: none; display: inline-block; }

        .mc-stats { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr); margin-bottom: 30px; }
        .mc-stat { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
        .mc-stat b { display: block; font-size: 28px; color: var(--olive-dark); text-align: left; }
        .mc-stat span { font-size: 13px; color: var(--muted); }

        .mc-grid { display: grid; gap: 22px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }

        .mc-card {
          display: flex; flex-direction: column; background: var(--card);
          border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.25s;
        }
        .mc-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--olive); }
        .mc-banner {
          height: 110px; position: relative; display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.92); font-size: 46px; font-weight: 800;
        }
        .mc-status {
          position: absolute; top: 12px; left: 12px; font-size: 12px; font-weight: 700;
          padding: 4px 10px; border-radius: 20px; background: rgba(255,255,255,0.92); color: var(--olive-dark);
          text-transform: capitalize;
        }
        .mc-status.pending { color: #8a6a45; }
        .mc-status.rejected { color: var(--danger); }
        .mc-body { padding: 18px; display: flex; flex-direction: column; flex: 1; text-align: left; }
        .mc-body h3 { margin: 0 0 6px; font-size: 18px; text-align: left; }
        .mc-meta { color: var(--muted); font-size: 14px; margin-bottom: 16px; }
        .mc-actions { margin-top: auto; display: flex; gap: 10px; }
        .mc-btn {
          flex: 1; text-align: center; text-decoration: none; padding: 10px 12px; border-radius: 8px;
          font-size: 14px; font-weight: 600; border: 1px solid var(--olive); transition: all 0.2s;
        }
        .mc-btn.solid { background: var(--olive); color: #fff; }
        .mc-btn.solid:hover { background: var(--olive-dark); }
        .mc-btn.ghost { background: transparent; color: var(--olive-dark); }
        .mc-btn.ghost:hover { background: var(--olive-light); }

        .mc-empty { text-align: center; padding: 60px 20px; background: var(--card); border: 1px dashed var(--border); border-radius: 16px; }
        .mc-empty h3 { margin: 0 0 6px; }
        .mc-empty p { margin: 0 0 18px; color: var(--muted); }
        .mc-empty .btn { display: inline-block; text-decoration: none; }

        .mc-skel {
          height: 250px; border-radius: 16px; border: 1px solid var(--border);
          background: linear-gradient(90deg, #ece5d0 25%, #f5f0e1 50%, #ece5d0 75%);
          background-size: 200% 100%; animation: mcShimmer 1.3s infinite;
        }
        @keyframes mcShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 760px) {
          .mc-page { padding: 24px 16px 40px; }
          .mc-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="mc-head">
        <div>
          <h1>My Courses</h1>
          <p>Create, manage and track the courses you teach.</p>
        </div>
        <Link to="/create-course" className="btn">+ Create Course</Link>
      </div>

      {!token && (
        <div className="mc-empty">
          <h3>Please log in</h3>
          <p>Log in as an Instructor to see your courses.</p>
          <Link to="/login" className="btn">Log in</Link>
        </div>
      )}

      {token && loading && (
        <div className="mc-grid">
          {[1, 2, 3].map((n) => (
            <div className="mc-skel" key={n}></div>
          ))}
        </div>
      )}

      {token && !loading && error && (
        <div className="mc-empty">
          <h3>Could not load your courses</h3>
          <p>Please check that the server is running and that you are logged in as an Instructor.</p>
          <button className="btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {token && !loading && !error && courses.length === 0 && (
        <div className="mc-empty">
          <h3>No courses yet</h3>
          <p>You haven't created any course. Start with your first one.</p>
          <Link to="/create-course" className="btn">Create Course</Link>
        </div>
      )}

      {token && !loading && !error && courses.length > 0 && (
        <>
          <div className="mc-stats">
            <div className="mc-stat"><b>{courses.length}</b><span>Total courses</span></div>
            <div className="mc-stat"><b>{totalEnrollments}</b><span>Total enrollments</span></div>
            <div className="mc-stat"><b>{approved}</b><span>Approved</span></div>
            <div className="mc-stat"><b>{pending}</b><span>Waiting for approval</span></div>
          </div>

          <div className="mc-grid">
            {courses.map((course, i) => {
              const st = statusOf(course).toLowerCase();
              return (
                <div className="mc-card" key={course.id}>
                  <div className="mc-banner" style={{ background: BANNERS[i % BANNERS.length] }}>
                    <span className={`mc-status ${st}`}>{st || "unknown"}</span>
                    {(course.title || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="mc-body">
                    <h3>{course.title}</h3>
                    <div className="mc-meta">
                      {Number(course.totalEnrollments) || 0} enrollments
                    </div>
                    <div className="mc-actions">
                      <Link to={`/manage-content/${course.id}`} className="mc-btn solid">
                        Manage Content
                      </Link>
                      <Link to={`/courses/${course.id}`} className="mc-btn ghost">
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default MyCourses;