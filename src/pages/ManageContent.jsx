import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const TYPES = [
  { value: "VIDEO", label: "Video" },
  { value: "PDF", label: "PDF" },
  { value: "TEXT", label: "Text" },
  { value: "DOWNLOADABLE", label: "Downloadable" },
];

const formatDuration = (sec) => {
  const s = Number(sec) || 0;
  if (!s) return "";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};

function ManageContent() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [lessonForms, setLessonForms] = useState({});
  const [openForm, setOpenForm] = useState({});
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState(null); // { type: "ok" | "err", text }

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  // FIX: the token is now sent with this request (it was missing before)
  const loadSections = () => {
    return axios
      .get(`http://localhost:8080/api/courses/${courseId}/sections`, authHeader)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setSections(data);
        setLoadError(false);
        setLoading(false);
      })
      .catch(() => {
        setSections([]);
        setLoadError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSections();
  }, [courseId]);

  const addSection = async (e) => {
    e.preventDefault();
    setBusy("section");
    try {
      await axios.post(
        `http://localhost:8080/api/courses/${courseId}/sections`,
        { title: sectionTitle, orderIndex: sections.length + 1 },
        authHeader
      );
      setSectionTitle("");
      notify("ok", "Section added.");
      await loadSections();
    } catch (err) {
      notify("err", "Failed to add section.");
    }
    setBusy("");
  };

  const handleLessonChange = (sectionId, field, value) => {
    setLessonForms((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };

  const addLesson = async (section) => {
    const form = lessonForms[section.id] || {};
    if (!form.title || !form.title.trim()) {
      notify("err", "Please enter a lesson title.");
      return;
    }
    setBusy("lesson-" + section.id);
    try {
      await axios.post(
        `http://localhost:8080/api/courses/sections/${section.id}/lessons`,
        {
          title: form.title || "",
          description: form.description || "",
          contentUrl: form.contentUrl || "",
          type: form.type || "VIDEO",
          durationSeconds: Number(form.durationSeconds) || 0,
          orderIndex: (section.lessons ? section.lessons.length : 0) + 1,
        },
        authHeader
      );
      setLessonForms((prev) => ({ ...prev, [section.id]: {} }));
      setOpenForm((prev) => ({ ...prev, [section.id]: false }));
      notify("ok", "Lesson added.");
      await loadSections();
    } catch (err) {
      notify("err", "Failed to add lesson.");
    }
    setBusy("");
  };

  const totalLessons = sections.reduce(
    (sum, s) => sum + (s.lessons ? s.lessons.length : 0),
    0
  );

  return (
    <div className="cm-page">
      <style>{`
        .cm-page { max-width: 900px; margin: 0 auto; padding: 36px 24px 60px; }
        .cm-back { display: inline-block; text-decoration: none; color: var(--olive-dark); font-size: 14px; font-weight: 600; margin-bottom: 12px; }
        .cm-back:hover { text-decoration: underline; }
        .cm-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
        .cm-head h1 { margin: 0 0 6px; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-align: left; }
        .cm-head p { margin: 0; color: var(--muted); text-align: left; }
        .cm-pill { background: var(--olive-light); color: var(--olive-dark); font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 20px; }

        .cm-toast { padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-bottom: 18px; text-align: left; }
        .cm-toast.ok { background: #e6efd9; color: #3d6326; border: 1px solid #c9dbb3; }
        .cm-toast.err { background: #f8e4e0; color: var(--danger); border: 1px solid #e8c2ba; }

        .cm-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 22px; box-shadow: var(--shadow); margin-bottom: 20px; }
        .cm-card h3 { margin: 0 0 12px; font-size: 18px; text-align: left; }
        .cm-add { display: flex; gap: 10px; }
        .cm-add input { flex: 1; font-size: 15px; padding: 12px 14px; }

        .cm-sec-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .cm-sec-title { display: flex; align-items: center; gap: 12px; }
        .cm-sec-no {
          width: 34px; height: 34px; border-radius: 10px; background: var(--olive); color: #fff;
          display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;
        }
        .cm-sec-title h3 { margin: 0; }
        .cm-sec-count { font-size: 13px; color: var(--muted); }

        .cm-lessons { list-style: none; margin: 0 0 14px; padding: 0; }
        .cm-lesson {
          display: flex; align-items: center; gap: 12px; padding: 10px 12px; margin-bottom: 6px;
          background: #fff; border: 1px solid var(--border); border-radius: 10px; text-align: left;
        }
        .cm-lesson-no { font-size: 13px; font-weight: 700; color: var(--muted); width: 22px; }
        .cm-lesson-name { flex: 1; font-size: 15px; font-weight: 600; }
        .cm-type { font-size: 11px; font-weight: 700; background: var(--olive-light); color: var(--olive-dark); padding: 3px 10px; border-radius: 20px; text-transform: uppercase; }
        .cm-dur { font-size: 13px; color: var(--muted); min-width: 40px; text-align: right; }
        .cm-nolesson { color: var(--muted); font-size: 14px; margin: 0 0 14px; text-align: left; }

        .cm-toggle {
          background: transparent; color: var(--olive-dark); border: 1px dashed var(--olive);
          padding: 10px 16px; border-radius: 10px; font-weight: 600; font-size: 14px; width: 100%; transition: background 0.2s;
        }
        .cm-toggle:hover { background: var(--olive-light); }

        .cm-form { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-top: 4px; }
        .cm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .cm-field { margin-bottom: 12px; text-align: left; }
        .cm-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; }
        .cm-field input, .cm-field select { width: 100%; font-size: 14px; padding: 10px 12px; }
        .cm-form-actions { display: flex; gap: 10px; }
        .cm-btn-ghost { background: transparent; color: var(--olive-dark); border: 1px solid var(--olive); padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; }
        .cm-btn-ghost:hover { background: var(--olive-light); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cm-empty { text-align: center; padding: 50px 20px; background: var(--card); border: 1px dashed var(--border); border-radius: 16px; }
        .cm-empty h3 { margin: 0 0 6px; }
        .cm-empty p { margin: 0 0 16px; color: var(--muted); }

        @media (max-width: 640px) {
          .cm-page { padding: 24px 16px 40px; }
          .cm-add { flex-direction: column; }
          .cm-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Link to="/my-courses" className="cm-back">← Back to My Courses</Link>

      <div className="cm-head">
        <div>
          <h1>Manage Course Content</h1>
          <p>Build your course with sections and lessons.</p>
        </div>
        <span className="cm-pill">
          {sections.length} sections · {totalLessons} lessons
        </span>
      </div>

      {message && <div className={`cm-toast ${message.type}`}>{message.text}</div>}

      <form className="cm-card" onSubmit={addSection}>
        <h3>Add a section</h3>
        <div className="cm-add">
          <input
            type="text"
            placeholder="e.g. Introduction"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            required
          />
          <button className="btn" type="submit" disabled={busy === "section"}>
            {busy === "section" ? "Adding..." : "Add Section"}
          </button>
        </div>
      </form>

      {loading && <p style={{ color: "var(--muted)" }}>Loading content...</p>}

      {!loading && loadError && (
        <div className="cm-empty">
          <h3>Could not load the content</h3>
          <p>Check that the server is running and that you are logged in as the instructor of this course.</p>
          <button className="btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !loadError && sections.length === 0 && (
        <div className="cm-empty">
          <h3>No sections yet</h3>
          <p>Add your first section above, then add lessons inside it.</p>
        </div>
      )}

      {!loading &&
        !loadError &&
        sections.map((section, idx) => {
          const lessons = section.lessons || [];
          const form = lessonForms[section.id] || {};
          const isOpen = !!openForm[section.id];
          return (
            <div className="cm-card" key={section.id}>
              <div className="cm-sec-head">
                <div className="cm-sec-title">
                  <span className="cm-sec-no">{idx + 1}</span>
                  <h3>{section.title}</h3>
                </div>
                <span className="cm-sec-count">{lessons.length} lessons</span>
              </div>

              {lessons.length === 0 ? (
                <p className="cm-nolesson">No lessons in this section yet.</p>
              ) : (
                <ul className="cm-lessons">
                  {lessons.map((lesson, i) => (
                    <li className="cm-lesson" key={lesson.id}>
                      <span className="cm-lesson-no">{i + 1}</span>
                      <span className="cm-lesson-name">{lesson.title}</span>
                      <span className="cm-type">{lesson.type}</span>
                      <span className="cm-dur">{formatDuration(lesson.durationSeconds)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {!isOpen && (
                <button
                  className="cm-toggle"
                  onClick={() => setOpenForm((prev) => ({ ...prev, [section.id]: true }))}
                >
                  + Add lesson
                </button>
              )}

              {isOpen && (
                <div className="cm-form">
                  <div className="cm-field">
                    <label>Lesson title</label>
                    <input
                      type="text"
                      placeholder="e.g. What is React?"
                      value={form.title || ""}
                      onChange={(e) => handleLessonChange(section.id, "title", e.target.value)}
                    />
                  </div>
                  <div className="cm-field">
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="A short summary of this lesson"
                      value={form.description || ""}
                      onChange={(e) => handleLessonChange(section.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="cm-field">
                    <label>Content URL (video or PDF link)</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={form.contentUrl || ""}
                      onChange={(e) => handleLessonChange(section.id, "contentUrl", e.target.value)}
                    />
                  </div>
                  <div className="cm-form-grid">
                    <div className="cm-field">
                      <label>Type</label>
                      <select
                        value={form.type || "VIDEO"}
                        onChange={(e) => handleLessonChange(section.id, "type", e.target.value)}
                      >
                        {TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="cm-field">
                      <label>Duration (seconds)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 600"
                        value={form.durationSeconds || ""}
                        onChange={(e) => handleLessonChange(section.id, "durationSeconds", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="cm-form-actions">
                    <button
                      className="btn"
                      onClick={() => addLesson(section)}
                      disabled={busy === "lesson-" + section.id}
                    >
                      {busy === "lesson-" + section.id ? "Adding..." : "Add Lesson"}
                    </button>
                    <button
                      className="cm-btn-ghost"
                      onClick={() => setOpenForm((prev) => ({ ...prev, [section.id]: false }))}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default ManageContent;