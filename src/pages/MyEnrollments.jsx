import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BANNERS = [
  "linear-gradient(135deg, #6b7a3a, #4a5528)",
  "linear-gradient(135deg, #8a6a45, #5f4529)",
  "linear-gradient(135deg, #9aa95a, #6b7a3a)",
  "linear-gradient(135deg, #a88b64, #8a6a45)",
  "linear-gradient(135deg, #556b2f, #3b4a1f)",
];

function MyEnrollments() {
  const token = localStorage.getItem("token");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:8080/api/enrollments/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setEnrollments(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [token]);

  const total = enrollments.length;
  const completed = enrollments.filter(
    (e) => Number(e.progressPercent) >= 100
  ).length;
  const inProgress = total - completed;

  const getPercent = (e) => {
    const p = Number(e.progressPercent);
    if (isNaN(p)) return 0;
    return Math.max(0, Math.min(100, Math.round(p)));
  };

  const buttonText = (p) => {
    if (p >= 100) return "Review course";
    if (p > 0) return "Continue learning";
    return "Start learning";
  };

  return (
    <div className="me-page">
      <style>{`
        .me-page { max-width: 1100px; margin: 0 auto; padding: 36px 24px 60px; }
        .me-head h1 { margin: 0 0 6px; font-size: 34px; font-weight: 800; letter-spacing: -0.5px; text-align: left; }
        .me-head p { margin: 0 0 26px; color: var(--muted); text-align: left; }

        .me-stats { display: grid; gap: 16px; grid-template-columns: repeat(3, 1fr); margin-bottom: 30px; }
        .me-stat {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px;
        }
        .me-stat b { display: block; font-size: 28px; color: var(--olive-dark); text-align: left; }
        .me-stat span { font-size: 13px; color: var(--muted); }

        .me-list { display: flex; flex-direction: column; gap: 18px; }

        .me-card {
          display: flex; gap: 20px; align-items: center;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 16px; transition: all 0.25s;
        }
        .me-card:hover { box-shadow: var(--shadow-lg); border-color: var(--olive); }

        .me-thumb {
          width: 150px; height: 110px; flex-shrink: 0; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.92); font-size: 44px; font-weight: 800;
        }

        .me-info { flex: 1; min-width: 0; }
        .me-info h3 { margin: 0 0 8px; font-size: 19px; text-align: left; }
        .me-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
        .me-tag {
          font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
          background: var(--olive-light); color: var(--olive-dark); text-transform: capitalize;
        }
        .me-tag.done { background: #dcebc9; color: #3d6326; }

        .me-bar { height: 8px; background: var(--olive-light); border-radius: 10px; overflow: hidden; }
        .me-bar div {
          height: 100%; background: linear-gradient(90deg, var(--olive), #9aa95a);
          border-radius: 10px; transition: width 0.4s ease;
        }
        .me-bar-text { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-top: 6px; }

        .me-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; width: 170px; }
        .me-btn {
          text-align: center; text-decoration: none; padding: 10px 14px; border-radius: 8px;
          font-size: 14px; font-weight: 600; transition: all 0.2s; border: 1px solid var(--olive);
        }
        .me-btn.solid { background: var(--olive); color: #fff; }
        .me-btn.solid:hover { background: var(--olive-dark); }
        .me-btn.ghost { background: transparent; color: var(--olive-dark); }
        .me-btn.ghost:hover { background: var(--olive-light); }

        .me-empty {
          text-align: center; padding: 60px 20px; background: var(--card);
          border: 1px dashed var(--border); border-radius: 16px;
        }
        .me-empty h3 { margin: 0 0 6px; }
        .me-empty p { margin: 0 0 18px; color: var(--muted); }
        .me-empty .btn { display: inline-block; text-decoration: none; }

        .me-skel {
          height: 140px; border-radius: 16px; border: 1px solid var(--border);
          background: linear-gradient(90deg, #ece5d0 25%, #f5f0e1 50%, #ece5d0 75%);
          background-size: 200% 100%; animation: meShimmer 1.3s infinite;
        }
        @keyframes meShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 760px) {
          .me-page { padding: 24px 16px 40px; }
          .me-stats { grid-template-columns: 1fr; }
          .me-card { flex-direction: column; align-items: stretch; }
          .me-thumb { width: 100%; height: 110px; }
          .me-actions { width: 100%; flex-direction: row; }
          .me-actions .me-btn { flex: 1; }
        }
      `}</style>

      <div className="me-head">
        <h1>My Enrollments</h1>
        <p>Pick up where you left off.</p>
      </div>

      {/* Not logged in */}
      {!token && (
        <div className="me-empty">
          <h3>Please log in</h3>
          <p>Log in to see the courses you have enrolled in.</p>
          <Link to="/login" className="btn">Log in</Link>
        </div>
      )}

      {/* Loading */}
      {token && loading && (
        <div className="me-list">
          {[1, 2, 3].map((n) => (
            <div className="me-skel" key={n}></div>
          ))}
        </div>
      )}

      {/* Error */}
      {token && !loading && error && (
        <div className="me-empty">
          <h3>Could not load your courses</h3>
          <p>Please check that the server is running and try again.</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {token && !loading && !error && total === 0 && (
        <div className="me-empty">
          <h3>No enrollments yet</h3>
          <p>You have not enrolled in any course. Find one you like and start learning.</p>
          <Link to="/courses" className="btn">Browse Courses</Link>
        </div>
      )}

      {/* List */}
      {token && !loading && !error && total > 0 && (
        <>
          <div className="me-stats">
            <div className="me-stat"><b>{total}</b><span>Enrolled courses</span></div>
            <div className="me-stat"><b>{inProgress}</b><span>In progress</span></div>
            <div className="me-stat"><b>{completed}</b><span>Completed</span></div>
          </div>

          <div className="me-list">
            {enrollments.map((enr, i) => {
              const percent = getPercent(enr);
              const title = enr.course?.title || "Untitled course";
              return (
                <div className="me-card" key={enr.id}>
                  <div
                    className="me-thumb"
                    style={{ background: BANNERS[i % BANNERS.length] }}
                  >
                    {title.charAt(0).toUpperCase()}
                  </div>

                  <div className="me-info">
                    <h3>{title}</h3>
                    <div className="me-tags">
                      {enr.status && (
                        <span className={`me-tag ${percent >= 100 ? "done" : ""}`}>
                          {String(enr.status).toLowerCase()}
                        </span>
                      )}
                      {enr.course?.category && (
                        <span className="me-tag">{enr.course.category}</span>
                      )}
                      {enr.course?.level && (
                        <span className="me-tag">{enr.course.level}</span>
                      )}
                    </div>
                    <div className="me-bar">
                      <div style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="me-bar-text">
                      <span>Progress</span>
                      <span>{percent}%</span>
                    </div>
                  </div>

                  <div className="me-actions">
                    <Link to={`/learn/${enr.course?.id}`} className="me-btn solid">
                      {buttonText(percent)}
                    </Link>
                    <Link to={`/courses/${enr.course?.id}`} className="me-btn ghost">
                      View details
                    </Link>
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

export default MyEnrollments;