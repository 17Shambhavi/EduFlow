import { useEffect, useState } from "react";
import axios from "axios";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const loadPending = () => {
    axios
      .get("http://localhost:8080/api/admin/courses/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/admin/courses/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Course approved!");
      loadPending();
    } catch (err) {
      setMessage("Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/admin/courses/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Course rejected!");
      loadPending();
    } catch (err) {
      setMessage("Failed to reject.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h2>Pending Courses</h2>
      {message && <p>{message}</p>}
      {courses.length === 0 && <p>No pending courses.</p>}
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
          <p>{course.description}</p>
          <p>Instructor: {course.instructor?.name}</p>
          <button onClick={() => handleApprove(course.id)} style={{ marginRight: "10px" }}>
            Approve
          </button>
          <button onClick={() => handleReject(course.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default AdminCourses;