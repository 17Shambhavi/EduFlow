package com.lms.repository;

import com.lms.model.LessonWatchLog;
import com.lms.model.Enrollment;
import com.lms.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonWatchLogRepository extends JpaRepository<LessonWatchLog, Long> {
    List<LessonWatchLog> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);

    @Query("SELECT COUNT(l) FROM LessonWatchLog l WHERE " +
            "l.enrollment = :enrollment AND " +
            "l.lesson = :lesson AND " +
            "l.skipped = false")
    Integer countWatchedSegments(Enrollment enrollment, Lesson lesson);

    @Query("SELECT COUNT(l) FROM LessonWatchLog l WHERE " +
            "l.enrollment = :enrollment AND " +
            "l.lesson = :lesson")
    Integer countTotalSegments(Enrollment enrollment, Lesson lesson);

    void deleteByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);
}