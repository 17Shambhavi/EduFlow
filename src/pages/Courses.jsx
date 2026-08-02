import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/courses/public")
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>Available Courses</h2>
      {courses.length === 0 && <p>No approved courses yet.</p>}
      {courses.map((course) => (
        <Link
          key={course.id}
          to={`/courses/${course.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>
              Category: {course.category} | Level: {course.level} | ₹
              {course.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Courses;