package com.smartcampus;

import com.smartcampus.audit.AuditService;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.events.*;
import com.smartcampus.notifications.NotificationRepository;
import com.smartcampus.user.Role;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private EventRegistrationRepository registrationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private EventService eventService;

    private CampusEvent event;
    private User student;

    @BeforeEach
    void setUp() {
        student = new User("student@campus.edu", "pwd", "Student Test", "STU10", Role.STUDENT);
        student.setId(10L);

        event = new CampusEvent();
        event.setId(50L);
        event.setTitle("Hackathon 2026");
        event.setMaxCapacity(2);
        event.setRegisteredCount(2);
        event.setStatus(EventStatus.UPCOMING);
    }

    @Test
    void testRsvp_FullCapacity_ThrowsBadRequest() {
        when(eventRepository.findById(50L)).thenReturn(Optional.of(event));
        when(userRepository.findById(10L)).thenReturn(Optional.of(student));
        when(registrationRepository.findByEventIdAndUserId(50L, 10L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> eventService.rsvpEvent(50L, 10L));
        verify(registrationRepository, never()).save(any());
    }

    @Test
    void testRsvp_DuplicateRegistration_ThrowsDuplicateException() {
        event.setRegisteredCount(1);
        EventRegistration existing = new EventRegistration(event, student);
        existing.setStatus("CONFIRMED");

        when(eventRepository.findById(50L)).thenReturn(Optional.of(event));
        when(userRepository.findById(10L)).thenReturn(Optional.of(student));
        when(registrationRepository.findByEventIdAndUserId(50L, 10L)).thenReturn(Optional.of(existing));

        assertThrows(DuplicateResourceException.class, () -> eventService.rsvpEvent(50L, 10L));
    }
}
