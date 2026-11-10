import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyEnrollments from "./pages/MyEnrollments";
import LearnCourse from "./pages/LearnCourse";
import CreateCourse from "./pages/CreateCourse";
import MyCourses from "./pages/MyCourses";
import ManageContent from "./pages/ManageContent";
import AdminCourses from "./pages/AdminCourses";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/learn/:courseId" element={<LearnCourse />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/manage-content/:courseId" element={<ManageContent />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;