package com.lms.controller;

import com.lms.model.LessonProgress;
import com.lms.model.User;
import com.lms.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/lesson/{lessonId}/complete")
    public ResponseEntity<LessonProgress> completeLesson(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                progressService.markLessonComplete(user, lessonId));
    }

    @PostMapping("/watchlog")
    public ResponseEntity<String> logSegment(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        Long lessonId = Long.valueOf(body.get("lessonId").toString());
        Integer start = (Integer) body.get("segmentStart");
        Integer end = (Integer) body.get("segmentEnd");
        boolean skipped = (boolean) body.get("skipped");
        progressService.logWatchSegment(user, lessonId, start, end, skipped);
        return ResponseEntity.ok("Segment logged!");
    }
}