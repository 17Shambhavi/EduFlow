import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h2>My Courses</h2>
      {courses.length === 0 && <p>You haven't created any courses yet.</p>}
      {courses.map((course) => (
        <div
          key={course.id}
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{course.title}</h3>
          <p>Status: {course.status}</p>
          <p>Enrollments: {course.totalEnrollments}</p>
          <Link to={`/courses/${course.id}`}>View / Manage</Link>
        </div>
      ))}
    </div>
  );
}

export default MyCourses;