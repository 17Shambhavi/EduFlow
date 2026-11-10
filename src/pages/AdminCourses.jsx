import { useEffect, useState } from "react";
import axios from "axios";

function AdminCourses() {
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }
  const [busyId, setBusyId] = useState(null);

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const loadPending = () => {
    return axios
      .get("http://localhost:8080/api/admin/courses/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(Array.isArray(res.data) ? res.data : res.data.content || []);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPending();
  }, []);

  const act = async (id, action) => {
    if (action === "reject" && !window.confirm("Reject this course?")) return;
    setBusyId(id);
    try {
      await axios.patch(
        `http://localhost:8080/api/admin/courses/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify("ok", action === "approve" ? "Course approved." : "Course rejected.");
      await loadPending();
    } catch (err) {
      notify("err", action === "approve" ? "Failed to approve." : "Failed to reject.");
    }
    setBusyId(null);
  };

  return (
    <div className="ad-page">
      <style>{`
        .ad-page { max-width: 900px; margin: 0 auto; padding: 36px 24px 60px; }
        .ad-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
        .ad-head h1 { margin: 0 0 6px; font-size: 34px; font-weight: 800; letter-spacing: -0.5px; text-align: left; }
        .ad-head p { margin: 0; color: var(--muted); text-align: left; }
        .ad-count { background: var(--olive-light); color: var(--olive-dark); font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 20px; }

        .ad-toast { padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-bottom: 18px; text-align: left; }
        .ad-toast.ok { background: #e6efd9; color: #3d6326; border: 1px solid #c9dbb3; }
        .ad-toast.err { background: #f8e4e0; color: var(--danger); border: 1px solid #e8c2ba; }

        .ad-list { display: flex; flex-direction: column; gap: 18px; }
        .ad-card {
          display: flex; gap: 20px; align-items: center; background: var(--card);
          border: 1px solid var(--border); border-radius: 16px; padding: 18px; transition: all 0.25s;
        }
        .ad-card:hover { box-shadow: var(--shadow-lg); border-color: var(--olive); }
        .ad-thumb {
          width: 90px; height: 90px; flex-shrink: 0; border-radius: 12px; color: rgba(255,255,255,0.92);
          background: linear-gradient(135deg, #6b7a3a, #4a5528); display: flex; align-items: center;
          justify-content: center; font-size: 36px; font-weight: 800;
        }
        .ad-info { flex: 1; min-width: 0; text-align: left; }
        .ad-info h3 { margin: 0 0 6px; font-size: 19px; text-align: left; }
        .ad-desc {
          margin: 0 0 10px; color: var(--muted); font-size: 14px; line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ad-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .ad-tag { font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--olive-light); color: var(--olive-dark); }

        .ad-actions { display: flex; flex-direction: column; gap: 8px; width: 130px; flex-shrink: 0; }
        .ad-approve { background: var(--olive); color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 14px; transition: background 0.2s; }
        .ad-approve:hover:not(:disabled) { background: var(--olive-dark); }
        .ad-reject { background: transparent; color: var(--danger); border: 1px solid var(--danger); padding: 9px; border-radius: 8px; font-weight: 600; font-size: 14px; transition: all 0.2s; }
        .ad-reject:hover:not(:disabled) { background: var(--danger); color: #fff; }
        .ad-approve:disabled, .ad-reject:disabled { opacity: 0.5; cursor: not-allowed; }

        .ad-empty { text-align: center; padding: 60px 20px; background: var(--card); border: 1px dashed var(--border); border-radius: 16px; }
        .ad-empty h3 { margin: 0 0 6px; }
        .ad-empty p { margin: 0 0 16px; color: var(--muted); }

        @media (max-width: 640px) {
          .ad-page { padding: 24px 16px 40px; }
          .ad-card { flex-direction: column; align-items: stretch; }
          .ad-actions { width: 100%; flex-direction: row; }
          .ad-actions button { flex: 1; }
        }
      `}</style>

      <div className="ad-head">
        <div>
          <h1>Pending Courses</h1>
          <p>Review new courses before they go live for students.</p>
        </div>
        {!loading && !error && <span className="ad-count">{courses.length} waiting</span>}
      </div>

      {message && <div className={`ad-toast ${message.type}`}>{message.text}</div>}

      {loading && <p style={{ color: "var(--muted)" }}>Loading...</p>}

      {!loading && error && (
        <div className="ad-empty">
          <h3>Could not load pending courses</h3>
          <p>Check that the server is running and that you are logged in as an Admin.</p>
          <button className="btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="ad-empty">
          <h3>All caught up</h3>
          <p>There are no courses waiting for approval right now.</p>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="ad-list">
          {courses.map((course) => (
            <div className="ad-card" key={course.id}>
              <div className="ad-thumb">{(course.title || "?").charAt(0).toUpperCase()}</div>
              <div className="ad-info">
                <h3>{course.title}</h3>
                <p className="ad-desc">{course.description}</p>
                <div className="ad-tags">
                  <span className="ad-tag">By {course.instructor?.name || "Instructor"}</span>
                  {course.category && <span className="ad-tag">{course.category}</span>}
                  {course.level && <span className="ad-tag">{course.level}</span>}
                  {course.price !== undefined && course.price !== null && (
                    <span className="ad-tag">
                      {Number(course.price) === 0 ? "Free" : `₹${course.price}`}
                    </span>
                  )}
                </div>
              </div>
              <div className="ad-actions">
                <button
                  className="ad-approve"
                  disabled={busyId === course.id}
                  onClick={() => act(course.id, "approve")}
                >
                  Approve
                </button>
                <button
                  className="ad-reject"
                  disabled={busyId === course.id}
                  onClick={() => act(course.id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCourses;