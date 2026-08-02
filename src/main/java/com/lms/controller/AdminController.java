package com.lms.controller;

import com.lms.model.Course;
import com.lms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final CourseService courseService;

    @GetMapping("/courses/pending")
    public ResponseEntity<List<Course>> getPendingCourses() {
        return ResponseEntity.ok(courseService.getPendingCourses());
    }

    @PatchMapping("/courses/{id}/approve")
    public ResponseEntity<Course> approveCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.approveCourse(id));
    }

    @PatchMapping("/courses/{id}/reject")
    public ResponseEntity<Course> rejectCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.rejectCourse(id));
    }
}