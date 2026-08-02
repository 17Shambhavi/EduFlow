import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/enrollments/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEnrollments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h2>My Enrollments</h2>
      {enrollments.length === 0 && <p>You haven't enrolled in any course yet.</p>}
      {enrollments.map((enr) => (
        <div
          key={enr.id}
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{enr.course?.title}</h3>
          <p>Status: {enr.status}</p>
          <p>Progress: {enr.progressPercent}%</p>
          <Link to={`/courses/${enr.course?.id}`}>View Course</Link>
        </div>
      ))}
    </div>
  );
}

export default MyEnrollments;