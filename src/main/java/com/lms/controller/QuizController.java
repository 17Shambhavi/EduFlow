package com.lms.controller;

import com.lms.dto.QuizRequest;
import com.lms.model.Quiz;
import com.lms.model.QuizAttempt;
import com.lms.model.User;
import com.lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Quiz> createQuiz(
            @RequestBody QuizRequest request) {
        return ResponseEntity.ok(quizService.createQuiz(request));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Quiz>> getCourseQuizzes(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getCourseQuizzes(courseId));
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<Long, String> answers,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                quizService.submitQuiz(user, quizId, answers));
    }

    @GetMapping("/{quizId}/attempts")
    public ResponseEntity<List<QuizAttempt>> getAttempts(
            @PathVariable Long quizId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                quizService.getMyAttempts(user, quizId));
    }
}