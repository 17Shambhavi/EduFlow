import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/courses",
        { title, description, category, level, price: Number(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Course created successfully!");
      setTimeout(() => navigate(`/courses/${res.data.id}`), 1000);
    } catch (err) {
      setMessage("Failed to create course. Are you logged in as an Instructor?");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {message && <p>{message}</p>}
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Create Course
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;