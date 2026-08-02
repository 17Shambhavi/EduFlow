package com.lms.repository;

import com.lms.model.Enrollment;
import com.lms.model.User;
import com.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourse(Course course);
    boolean existsByStudentAndCourse(User student, Course course);
    Integer countByCourse(Course course);

    @Query("SELECT e FROM Enrollment e WHERE e.course.instructor.id = :instructorId")
    List<Enrollment> findByInstructorId(Long instructorId);
}