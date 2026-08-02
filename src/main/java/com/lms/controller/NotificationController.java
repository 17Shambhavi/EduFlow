package com.lms.controller;

import jakarta.persistence.Column;
import com.lms.model.Notification;
import com.lms.model.User;
import com.lms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                notificationService.getMyNotifications(user));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadCount(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                notificationService.getUnreadCount(user));
    }

    @PatchMapping("/mark-read")
    public ResponseEntity<String> markAllRead(
            @AuthenticationPrincipal User user) {
        notificationService.markAllRead(user);
        return ResponseEntity.ok("All notifications marked as read!");
    }
}