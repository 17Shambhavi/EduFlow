package com.lms.controller;

import com.lms.dto.CourseRequest;
import com.lms.model.Course;
import com.lms.model.User;
import com.lms.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/public")
    public ResponseEntity<List<Course>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        if (search != null) {
            return ResponseEntity.ok(courseService.searchCourses(search));
        }
        if (category != null || level != null ||
                minPrice != null || maxPrice != null) {
            return ResponseEntity.ok(
                    courseService.filterCourses(category, level, minPrice, maxPrice));
        }
        return ResponseEntity.ok(courseService.getAllApprovedCourses());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Course> createCourse(
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.createCourse(request, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.updateCourse(id, request, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<String> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        courseService.deleteCourse(id, user);
        return ResponseEntity.ok("Course deleted!");
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<Course>> getMyCourses(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.getInstructorCourses(user));
    }
}