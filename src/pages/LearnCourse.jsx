import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function LearnCourse() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");

  const [sections, setSections] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/courses/${courseId}/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
        setSections(data);
        if (data.length > 0 && data[0].lessons && data[0].lessons.length > 0) {
          setActiveLesson(data[0].lessons[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  const renderPlayer = (lesson) => {
    if (!lesson) return <p style={styles.mutedText}>No lesson selected yet.</p>;

    const url = lesson.contentUrl || "";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1];
      }
      return (
        <iframe
          width="100%"
          height="420"
          style={styles.player}
          src={`https://www.youtube.com/embed/${videoId}`}
          title={lesson.title}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      );
    }

    if (lesson.type === "PDF") {
      return <iframe src={url} width="100%" height="520" style={styles.player} title={lesson.title}></iframe>;
    }

    if (lesson.type === "VIDEO") {
      return (
        <video width="100%" height="420" controls style={styles.player}>
          <source src={url} />
        </video>
      );
    }

    return <p style={styles.mutedText}>{lesson.description}</p>;
  };

  if (loading) return <p style={styles.pageLoading}>Loading course...</p>;

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Course Content</h3>
        {sections.length === 0 && <p style={styles.mutedText}>No content added yet.</p>}
        {sections.map((section) => (
          <div key={section.id} style={styles.sectionBlock}>
            <div style={styles.sectionTitle}>{section.title}</div>
            <ul style={styles.lessonList}>
              {section.lessons &&
                section.lessons.map((lesson) => {
                  const isActive = activeLesson && activeLesson.id === lesson.id;
                  return (
                    <li
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      style={{
                        ...styles.lessonItem,
                        ...(isActive ? styles.lessonItemActive : {}),
                      }}
                    >
                      {lesson.title}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <h2 style={styles.lessonHeading}>
          {activeLesson ? activeLesson.title : "Select a lesson"}
        </h2>
        {renderPlayer(activeLesson)}
        {activeLesson && <p style={styles.lessonDescription}>{activeLesson.description}</p>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    maxWidth: "1100px",
    margin: "40px auto",
    gap: "24px",
    padding: "0 20px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sidebar: {
    width: "300px",
    flexShrink: 0,
    background: "#1b1b1f",
    border: "1px solid #2e2e34",
    borderRadius: "10px",
    padding: "18px",
    height: "fit-content",
  },
  sidebarTitle: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "14px",
    color: "#f0f0f3",
  },
  sectionBlock: { marginBottom: "16px" },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#9d9dae",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginBottom: "6px",
  },
  lessonList: { listStyle: "none", padding: 0, margin: 0 },
  lessonItem: {
    cursor: "pointer",
    padding: "9px 10px",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#d4d4dc",
    marginBottom: "4px",
    transition: "background 0.15s ease",
  },
  lessonItemActive: {
    background: "#3b5bfd22",
    color: "#8ab4ff",
    fontWeight: 600,
  },
  content: {
    flex: 1,
    background: "#1b1b1f",
    border: "1px solid #2e2e34",
    borderRadius: "10px",
    padding: "24px",
  },
  lessonHeading: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "16px",
    color: "#f0f0f3",
  },
  lessonDescription: {
    marginTop: "16px",
    color: "#b4b4c0",
    fontSize: "14px",
    lineHeight: 1.6,
      },
      player: { borderRadius: "8px", border: "1px solid #2e2e34" },
      mutedText: { color: "#9d9dae", fontSize: "14px" },
      pageLoading: { textAlign: "center", marginTop: "60px", color: "#9d9dae" },
    };

    export default LearnCourse;