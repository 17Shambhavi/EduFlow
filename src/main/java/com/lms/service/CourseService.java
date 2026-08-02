package com.lms.service;

import com.lms.dto.CourseRequest;
import com.lms.model.Course;
import com.lms.model.User;
import com.lms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public Course createCourse(CourseRequest request, User instructor) {
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .level(request.getLevel())
                .thumbnailUrl(request.getThumbnailUrl())
                .instructor(instructor)
                .build();
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, CourseRequest request, User instructor) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("Unauthorized!");
        }
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        course.setThumbnailUrl(request.getThumbnailUrl());
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id, User instructor) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("Unauthorized!");
        }
        courseRepository.delete(course);
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
    }

    public List<Course> getAllApprovedCourses() {
        return courseRepository.findByStatus(Course.Status.APPROVED);
    }

    public List<Course> getInstructorCourses(User instructor) {
        return courseRepository.findByInstructor(instructor);
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepository.searchByKeyword(keyword);
    }

    public List<Course> filterCourses(String category, String level,
                                      Double minPrice, Double maxPrice) {
        return courseRepository.filterCourses(category, level, minPrice, maxPrice);
    }

    public Course approveCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        course.setStatus(Course.Status.APPROVED);
        return courseRepository.save(course);
    }

    public Course rejectCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found!"));
        course.setStatus(Course.Status.REJECTED);
        return courseRepository.save(course);
    }

    public List<Course> getPendingCourses() {
        return courseRepository.findByStatus(Course.Status.PENDING);
    }
}