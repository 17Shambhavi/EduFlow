package com.lms.repository;

import com.lms.model.LessonProgress;
import com.lms.model.Enrollment;
import com.lms.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);
    List<LessonProgress> findByEnrollment(Enrollment enrollment);
    Integer countByEnrollmentAndCompletedTrue(Enrollment enrollment);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE " +
            "lp.enrollment = :enrollment AND lp.completed = true")
    Integer countCompletedLessons(Enrollment enrollment);
}