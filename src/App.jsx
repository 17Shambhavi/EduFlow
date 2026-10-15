import ManageContent from "./pages/ManageContent";
import MyCourses from "./pages/MyCourses";
import LearnCourse from "./pages/LearnCourse";
import CreateCourse from "./pages/CreateCourse";
import MyEnrollments from "./pages/MyEnrollments";
import CourseDetail from "./pages/CourseDetail";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
        <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/my-enrollments" element={<MyEnrollments />} />
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/manage-content/:courseId" element={<ManageContent />} />
      <Route path="/learn/:courseId" element={<LearnCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;