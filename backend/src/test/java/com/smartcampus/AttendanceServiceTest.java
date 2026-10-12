package com.smartcampus;

import com.smartcampus.academics.Subject;
import com.smartcampus.attendance.*;
import com.smartcampus.audit.AuditService;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.department.Section;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AttendanceServiceTest {

    @Mock
    private AttendanceSessionRepository sessionRepository;
    @Mock
    private AttendanceRecordRepository recordRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private AttendanceService attendanceService;

    private AttendanceSession activeSession;
    private User student;

    @BeforeEach
    void setUp() {
        student = new User("student@campus.edu", "pwd", "Student A", "STU10", Role.STUDENT);
        student.setId(5L);

        Subject subject = new Subject();
        subject.setId(1L);
        subject.setName("Database Systems");
        subject.setCode("CS302");

        Section section = new Section();
        section.setId(1L);
        section.setName("Section A");

        activeSession = new AttendanceSession();
        activeSession.setId(100L);
        activeSession.setSubject(subject);
        activeSession.setSection(section);
        activeSession.setQrToken("CAMPUS-VALID-QR-123");
        activeSession.setQrExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));
        activeSession.setIsActive(true);
        activeSession.setGeofenceEnabled(true);
        activeSession.setLatitude(BigDecimal.valueOf(12.9716000));
        activeSession.setLongitude(BigDecimal.valueOf(77.5946000));
        activeSession.setRadiusMeters(50.0);
    }

    @Test
    void testCheckIn_DuplicateSubmission_ThrowsException() {
        CheckInRequest req = new CheckInRequest("CAMPUS-VALID-QR-123");
        req.setLatitude(BigDecimal.valueOf(12.9716010));
        req.setLongitude(BigDecimal.valueOf(77.5946010));

        when(sessionRepository.findByQrToken("CAMPUS-VALID-QR-123")).thenReturn(Optional.of(activeSession));
        when(userRepository.findById(5L)).thenReturn(Optional.of(student));
        when(recordRepository.existsBySessionIdAndStudentId(100L, 5L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> attendanceService.submitCheckIn(5L, req));
        verify(recordRepository, never()).save(any());
    }

    @Test
    void testCheckIn_OutOfBounds_ThrowsException() {
        CheckInRequest req = new CheckInRequest("CAMPUS-VALID-QR-123");
        // Coordinates 1 km away
        req.setLatitude(BigDecimal.valueOf(12.9816000));
        req.setLongitude(BigDecimal.valueOf(77.5946000));

        when(sessionRepository.findByQrToken("CAMPUS-VALID-QR-123")).thenReturn(Optional.of(activeSession));
        when(userRepository.findById(5L)).thenReturn(Optional.of(student));
        when(recordRepository.existsBySessionIdAndStudentId(100L, 5L)).thenReturn(false);

        assertThrows(BadRequestException.class, () -> attendanceService.submitCheckIn(5L, req));
        verify(recordRepository, never()).save(any());
    }

    @Test
    void testCheckIn_Success() {
        CheckInRequest req = new CheckInRequest("CAMPUS-VALID-QR-123");
        // Coordinates ~2 meters away
        req.setLatitude(BigDecimal.valueOf(12.9716020));
        req.setLongitude(BigDecimal.valueOf(77.5946010));

        when(sessionRepository.findByQrToken("CAMPUS-VALID-QR-123")).thenReturn(Optional.of(activeSession));
        when(userRepository.findById(5L)).thenReturn(Optional.of(student));
        when(recordRepository.existsBySessionIdAndStudentId(100L, 5L)).thenReturn(false);

        AttendanceRecord record = new AttendanceRecord();
        record.setId(500L);
        record.setSession(activeSession);
        record.setStudent(student);
        record.setStatus(AttendanceStatus.PRESENT);
        record.setCheckInTime(Instant.now());
        record.setDistanceMeters(2.1);

        when(recordRepository.save(any())).thenReturn(record);

        RecordDto result = attendanceService.submitCheckIn(5L, req);
        assertNotNull(result);
        assertEquals(AttendanceStatus.PRESENT, result.getStatus());
        verify(notificationRepository).save(any());
    }
}
