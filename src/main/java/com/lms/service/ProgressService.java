package com.lms.service;

import com.lms.model.*;
import com.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonWatchLogRepository lessonWatchLogRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentService enrollmentService;

    public LessonProgress markLessonComplete(User student, Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found!"));

        Long courseId = lesson.getSection().getCourse().getId();
        Enrollment enrollment = enrollmentService.getEnrollment(student, courseId);

        // Anti-skip check
        Integer watched = lessonWatchLogRepository
                .countWatchedSegments(enrollment, lesson);
        Integer total = lessonWatchLogRepository
                .countTotalSegments(enrollment, lesson);

        if (total != null && total > 0) {
            double watchedPercent = (watched * 100.0) / total;
            if (watchedPercent < 90.0) {
                // Reset progress
                lessonWatchLogRepository.deleteByEnrollmentAndLesson(enrollment, lesson);
                throw new RuntimeException(
                        "Please watch at least 90% of the video to complete this lesson!");
            }
        }

        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentAndLesson(enrollment, lesson)
                .orElse(LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .build());

        progress.setCompleted(true);
        progress.setWatchedPercent(100.0);
        return lessonProgressRepository.save(progress);
    }

    public void logWatchSegment(User student, Long lessonId,
                                Integer start, Integer end, boolean skipped) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found!"));

        Long courseId = lesson.getSection().getCourse().getId();
        Enrollment enrollment = enrollmentService.getEnrollment(student, courseId);

        LessonWatchLog log = LessonWatchLog.builder()
                .enrollment(enrollment)
                .lesson(lesson)
                .segmentStart(start)
                .segmentEnd(end)
                .skipped(skipped)
                .build();

        lessonWatchLogRepository.save(log);
    }
}