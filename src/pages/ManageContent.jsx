import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ManageContent() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");

  const [sections, setSections] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [message, setMessage] = useState("");
  const [lessonForms, setLessonForms] = useState({});

  const loadSections = () => {
    axios
      .get(`http://localhost:8080/api/courses/${courseId}/sections`)
      .then((res) => {
          console.log("SECTIONS DATA:", res.data);
        setSections(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setSections([]));
  };

  useEffect(() => {
    loadSections();
  }, [courseId]);

  const addSection = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8080/api/courses/${courseId}/sections`,
        { title: sectionTitle, orderIndex: sections.length + 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSectionTitle("");
      setMessage("Section added!");
      loadSections();
    } catch (err) {
      setMessage("Failed to add section.");
    }
  };

  const handleLessonChange = (sectionId, field, value) => {
    setLessonForms((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };

  const addLesson = async (sectionId) => {
    const form = lessonForms[sectionId] || {};
    try {
      await axios.post(
        `http://localhost:8080/api/courses/sections/${sectionId}/lessons`,
        {
          title: form.title || "",
          description: form.description || "",
          contentUrl: form.contentUrl || "",
          type: form.type || "VIDEO",
          durationSeconds: Number(form.durationSeconds) || 0,
          orderIndex: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLessonForms((prev) => ({ ...prev, [sectionId]: {} }));
      setMessage("Lesson added!");
      loadSections();
    } catch (err) {
      setMessage("Failed to add lesson.");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h2>Manage Course Content</h2>
      {message && <p>{message}</p>}

      <form onSubmit={addSection} style={{ marginBottom: "30px" }}>
        <h3>Add Section</h3>
        <input
          type="text"
          placeholder="Section title"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          required
          style={{ width: "70%", padding: "8px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 15px" }}>
          Add Section
        </button>
      </form>

      {sections.map((section) => (
        <div
          key={section.id}
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{section.title}</h3>

          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Lesson title"
              value={lessonForms[section.id]?.title || ""}
              onChange={(e) =>
                handleLessonChange(section.id, "title", e.target.value)
              }
              style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
            />
            <input
              type="text"
              placeholder="Description"
              value={lessonForms[section.id]?.description || ""}
              onChange={(e) =>
                handleLessonChange(section.id, "description", e.target.value)
              }
              style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
            />
            <input
              type="text"
              placeholder="Content URL (video/pdf link)"
              value={lessonForms[section.id]?.contentUrl || ""}
              onChange={(e) =>
                handleLessonChange(section.id, "contentUrl", e.target.value)
              }
              style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
            />
            <select
              value={lessonForms[section.id]?.type || "VIDEO"}
              onChange={(e) =>
                handleLessonChange(section.id, "type", e.target.value)
              }
              style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
            >
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
              <option value="TEXT">Text</option>
              <option value="DOWNLOADABLE">Downloadable</option>
            </select>
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={lessonForms[section.id]?.durationSeconds || ""}
              onChange={(e) =>
                handleLessonChange(
                  section.id,
                  "durationSeconds",
                  e.target.value
                )
              }
              style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
            />
            <button
              onClick={() => addLesson(section.id)}
              style={{ padding: "8px 15px" }}
            >
              Add Lesson
            </button>
          </div>

          {section.lessons && section.lessons.length > 0 && (
            <ul>
              {section.lessons.map((lesson) => (
                <li key={lesson.id}>
                  {lesson.title} ({lesson.type})
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManageContent;