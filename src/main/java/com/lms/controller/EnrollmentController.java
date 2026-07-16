package com.lms.controller;

import com.lms.model.Enrollment;
import com.lms.model.User;
import com.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/{courseId}")
    public ResponseEntity<Enrollment> enroll(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                enrollmentService.enrollStudent(user, courseId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Enrollment>> myEnrollments(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                enrollmentService.getMyEnrollments(user));
    }

    @GetMapping("/{courseId}/progress")
    public ResponseEntity<Double> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                enrollmentService.getCourseProgress(user, courseId));
    }
}