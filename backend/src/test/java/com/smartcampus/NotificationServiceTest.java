package com.smartcampus;

import com.smartcampus.common.BadRequestException;
import com.smartcampus.notifications.*;
import com.smartcampus.user.Role;
import com.smartcampus.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User userOwner;
    private Notification notification;

    @BeforeEach
    void setUp() {
        userOwner = new User("owner@campus.edu", "pwd", "Owner User", "OWN01", Role.STUDENT);
        userOwner.setId(100L);

        notification = new Notification(
                userOwner,
                "Class Alert",
                "Your morning lecture room changed to LH-201",
                NotificationType.TIMETABLE,
                1L
        );
        notification.setId(10L);
    }

    @Test
    void testGetUserNotifications_Success() {
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(100L))
                .thenReturn(List.of(notification));

        List<NotificationDto> result = notificationService.getUserNotifications(100L);

        assertEquals(1, result.size());
        assertEquals("Class Alert", result.get(0).getTitle());
    }

    @Test
    void testMarkAsRead_OtherUser_ThrowsBadRequestException() {
        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));

        // User 999 is attempting to mark user 100's notification as read
        assertThrows(BadRequestException.class, () -> notificationService.markAsRead(10L, 999L));
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void testMarkAsRead_Owner_Success() {
        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any())).thenReturn(notification);

        NotificationDto result = notificationService.markAsRead(10L, 100L);

        assertNotNull(result);
        assertTrue(result.getIsRead());
        verify(notificationRepository).save(notification);
    }
}
