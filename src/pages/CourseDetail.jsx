import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
    try {
      await axios.post(
        `http://localhost:8080/api/enrollments/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Enrolled successfully!");
    } catch (err) {
      setMessage("Enrollment failed. You may already be enrolled.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>
        Category: {course.category} | Level: {course.level}
      </p>
      <p>Price: ₹{course.price}</p>
      <p>Instructor: {course.instructor?.name}</p>

      <button onClick={handleEnroll} style={{ padding: "10px 20px" }}>
        Enroll Now
      </button>

      <Link to={`/learn/${course.id}`}>
        <button style={{ padding: "10px 20px", marginLeft: "10px" }}>
          Go to Course
        </button>
      </Link>

      {localStorage.getItem("role") === "INSTRUCTOR" && (
        <Link to={`/manage-content/${course.id}`}>
          <button style={{ padding: "10px 20px", marginLeft: "10px" }}>
            Manage Content
          </button>
        </Link>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default CourseDetail;