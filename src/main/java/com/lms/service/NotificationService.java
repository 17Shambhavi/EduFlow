package com.lms.service;

import com.lms.model.Notification;
import com.lms.model.User;
import com.lms.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void sendNotification(User user, String message, String type) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public void markAllRead(User user) {
        List<Notification> unread = notificationRepository
                .findByUserAndReadFalse(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public Integer getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }
}