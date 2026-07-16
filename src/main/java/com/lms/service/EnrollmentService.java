package com.lms.service;

import com.lms.model.*;
import com.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final SectionRepository sectionRepository;

    public Enrollment enrollStudent(User student, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found!"));

        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Already enrolled!");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);

        course.setTotalEnrollments(course.getTotalEnrollments() + 1);
        courseRepository.save(course);

        return saved;
    }

    public List<Enrollment> getMyEnrollments(User student) {
        return enrollmentRepository.findByStudent(student);
    }

    public Enrollment getEnrollment(User student, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        return enrollmentRepository.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new RuntimeException("Not enrolled!"));
    }

    public Double getCourseProgress(User student, Long courseId) {
        Enrollment enrollment = getEnrollment(student, courseId);
        List<Section> sections = sectionRepository
                .findByCourseIdOrderByOrderIndexAsc(courseId);

        int totalLessons = 0;
        for (Section section : sections) {
            totalLessons += lessonRepository.countBySectionId(section.getId());
        }

        if (totalLessons == 0) return 0.0;

        int completedLessons = lessonProgressRepository
                .countByEnrollmentAndCompletedTrue(enrollment);

        double progress = (completedLessons * 100.0) / totalLessons;
        enrollment.setProgressPercent(progress);

        if (progress == 100.0) {
            enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
        }

        enrollmentRepository.save(enrollment);
        return progress;
    }
}