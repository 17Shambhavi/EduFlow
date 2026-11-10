import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function LearnCourse() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");
  const storageKey = `completed_lessons_${courseId}`;

  const [sections, setSections] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/courses/${courseId}/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setSections(data);
        const first = data.find((s) => s.lessons && s.lessons.length > 0);
        if (first) setActiveLesson(first.lessons[0]);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [courseId]);

  // Saare lessons ek line mein (next / previous ke liye)
  const allLessons = sections.flatMap((s) => s.lessons || []);
  const activeIndex = activeLesson
    ? allLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson =
    activeIndex >= 0 && activeIndex < allLessons.length - 1
      ? allLessons[activeIndex + 1]
      : null;

  const total = allLessons.length;
  const doneCount = allLessons.filter((l) => completed.includes(l.id)).length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const isDone = activeLesson ? completed.includes(activeLesson.id) : false;

  const toggleComplete = () => {
    if (!activeLesson) return;
    const updated = isDone
      ? completed.filter((id) => id !== activeLesson.id)
      : [...completed, activeLesson.id];
    setCompleted(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const goTo = (lesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPlayer = (lesson) => {
    if (!lesson) return <div className="lc-note">No lesson selected yet.</div>;

    const url = lesson.contentUrl || "";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }
      return (
        <div className="lc-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={lesson.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    if (lesson.type === "PDF") {
      return (
        <iframe className="lc-pdf" src={url} title={lesson.title}></iframe>
      );
    }

    if (lesson.type === "VIDEO") {
      return (
        <div className="lc-video">
          <video controls>
            <source src={url} />
          </video>
        </div>
      );
    }

    return (
      <div className="lc-note">
        {lesson.description || "This lesson has no content yet."}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="lc-center">
        <p>Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lc-center">
        <h3>Could not load this course</h3>
        <p>Please check that you are enrolled and the server is running.</p>
        <Link to="/my-enrollments" className="btn">
          Back to My Enrollments
        </Link>
      </div>
    );
  }

  return (
    <div className="lc-page">
      <style>{`
        .lc-page {
          display: flex; gap: 24px; align-items: flex-start;
          max-width: 1280px; margin: 0 auto; padding: 28px 24px 60px;
        }
        .lc-center { text-align: center; padding: 80px 20px; color: var(--muted); }
        .lc-center h3 { color: var(--text); margin: 0 0 6px; }
        .lc-center .btn { display: inline-block; text-decoration: none; margin-top: 10px; }

        /* MAIN */
        .lc-main { flex: 1; min-width: 0; }
        .lc-back {
          display: inline-block; text-decoration: none; color: var(--olive-dark);
          font-size: 14px; font-weight: 600; margin-bottom: 14px;
        }
        .lc-back:hover { text-decoration: underline; }

        .lc-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 22px; box-shadow: var(--shadow);
        }
        .lc-title-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 14px; flex-wrap: wrap; margin-bottom: 16px;
        }
        .lc-eyebrow { font-size: 12px; font-weight: 700; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
        .lc-title { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.3px; text-align: left; }

        .lc-video {
          position: relative; width: 100%; aspect-ratio: 16 / 9;
          border-radius: 12px; overflow: hidden; background: #1f2216;
          border: 1px solid var(--border);
        }
        .lc-video iframe, .lc-video video {
          position: absolute; inset: 0; width: 100%; height: 100%; border: 0;
        }
        .lc-pdf {
          width: 100%; height: 560px; border-radius: 12px;
          border: 1px solid var(--border); background: #fff;
        }
        .lc-note {
          padding: 40px 24px; background: var(--bg); border: 1px dashed var(--border);
          border-radius: 12px; color: var(--muted); text-align: center;
        }

        .lc-desc { margin: 18px 0 0; color: var(--muted); font-size: 15px; line-height: 1.7; text-align: left; }

        .lc-actions {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap; margin-top: 22px; padding-top: 18px;
          border-top: 1px solid var(--border);
        }
        .lc-nav { display: flex; gap: 10px; }
        .lc-btn {
          border-radius: 8px; padding: 10px 18px; font-size: 14px; font-weight: 600;
          transition: all 0.2s; border: 1px solid var(--olive);
        }
        .lc-btn.ghost { background: transparent; color: var(--olive-dark); }
        .lc-btn.ghost:hover:not(:disabled) { background: var(--olive-light); }
        .lc-btn.solid { background: var(--olive); color: #fff; }
        .lc-btn.solid:hover:not(:disabled) { background: var(--olive-dark); }
        .lc-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .lc-complete {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: var(--text); border: 1px solid var(--border);
          border-radius: 8px; padding: 10px 16px; font-size: 14px; font-weight: 600;
          transition: all 0.2s;
        }
        .lc-complete:hover { border-color: var(--olive); }
        .lc-complete.done { background: var(--success); color: #fff; border-color: var(--success); }
        .lc-tick {
          width: 18px; height: 18px; border-radius: 50%; border: 2px solid currentColor;
          display: inline-flex; align-items: center; justify-content: center; font-size: 11px;
        }

        /* SIDEBAR */
        .lc-side {
          width: 340px; flex-shrink: 0; position: sticky; top: 90px;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; box-shadow: var(--shadow); overflow: hidden;
        }
        .lc-side-head { padding: 18px 18px 16px; border-bottom: 1px solid var(--border); }
        .lc-side-head h3 { margin: 0 0 12px; font-size: 17px; text-align: left; }
        .lc-bar { height: 8px; background: var(--olive-light); border-radius: 10px; overflow: hidden; }
        .lc-bar div {
          height: 100%; background: linear-gradient(90deg, var(--olive), #9aa95a);
          border-radius: 10px; transition: width 0.4s ease;
        }
        .lc-bar-text { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-top: 8px; }

        .lc-side-body { max-height: calc(100vh - 260px); overflow-y: auto; padding: 8px 10px 12px; }
        .lc-sec-title {
          font-size: 12px; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.5px; padding: 14px 8px 6px; text-align: left;
        }
        .lc-lesson {
          display: flex; align-items: center; gap: 10px; padding: 10px; margin-bottom: 3px;
          border-radius: 8px; cursor: pointer; font-size: 14px; color: var(--text);
          transition: background 0.15s; text-align: left;
        }
        .lc-lesson:hover { background: var(--card-hover); }
        .lc-lesson.active { background: var(--olive-light); color: var(--olive-dark); font-weight: 600; }
        .lc-dot {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid var(--border); display: flex; align-items: center;
          justify-content: center; font-size: 11px; color: #fff;
        }
        .lc-lesson.done .lc-dot { background: var(--success); border-color: var(--success); }
        .lc-empty { padding: 18px; color: var(--muted); font-size: 14px; }

        @media (max-width: 960px) {
          .lc-page { flex-direction: column-reverse; padding: 18px 14px 40px; }
          .lc-side { width: 100%; position: static; }
          .lc-side-body { max-height: 360px; }
          .lc-pdf { height: 420px; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="lc-side">
        <div className="lc-side-head">
          <h3>Course Content</h3>
          <div className="lc-bar">
            <div style={{ width: `${percent}%` }}></div>
          </div>
          <div className="lc-bar-text">
            <span>
              {doneCount} of {total} lessons
            </span>
            <span>{percent}%</span>
          </div>
        </div>

        <div className="lc-side-body">
          {sections.length === 0 && (
            <div className="lc-empty">No content added yet.</div>
          )}
          {sections.map((section) => (
            <div key={section.id}>
              <div className="lc-sec-title">{section.title}</div>
              {section.lessons &&
                section.lessons.map((lesson) => {
                  const active = activeLesson && activeLesson.id === lesson.id;
                  const done = completed.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => goTo(lesson)}
                      className={`lc-lesson ${active ? "active" : ""} ${done ? "done" : ""}`}
                    >
                      <span className="lc-dot">{done ? "✓" : ""}</span>
                      {lesson.title}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="lc-main">
        <Link to="/my-enrollments" className="lc-back">
          ← Back to My Enrollments
        </Link>

        <div className="lc-card">
          <div className="lc-title-row">
            <div>
              {activeIndex >= 0 && (
                <div className="lc-eyebrow">
                  Lesson {activeIndex + 1} of {total}
                </div>
              )}
              <h2 className="lc-title">
                {activeLesson ? activeLesson.title : "Select a lesson"}
              </h2>
            </div>
          </div>

          {renderPlayer(activeLesson)}

          {activeLesson && activeLesson.description && (
            <p className="lc-desc">{activeLesson.description}</p>
          )}

          {activeLesson && (
            <div className="lc-actions">
              <button
                className={`lc-complete ${isDone ? "done" : ""}`}
                onClick={toggleComplete}
              >
                <span className="lc-tick">{isDone ? "✓" : ""}</span>
                {isDone ? "Completed" : "Mark as complete"}
              </button>

              <div className="lc-nav">
                <button
                  className="lc-btn ghost"
                  disabled={!prevLesson}
                  onClick={() => goTo(prevLesson)}
                >
                  ← Previous
                </button>
                <button
                  className="lc-btn solid"
                  disabled={!nextLesson}
                  onClick={() => goTo(nextLesson)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LearnCourse;