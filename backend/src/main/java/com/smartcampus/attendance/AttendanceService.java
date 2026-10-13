package com.smartcampus.attendance;

import com.smartcampus.academics.Subject;
import com.smartcampus.academics.SubjectRepository;
import com.smartcampus.audit.AuditService;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.common.GeoUtils;
import com.smartcampus.common.ResourceNotFoundException;
import com.smartcampus.department.Classroom;
import com.smartcampus.department.ClassroomRepository;
import com.smartcampus.department.Section;
import com.smartcampus.department.SectionRepository;
import com.smartcampus.notifications.Notification;
import com.smartcampus.notifications.NotificationRepository;
import com.smartcampus.notifications.NotificationType;
import com.smartcampus.user.Role;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;
    private final SubjectRepository subjectRepository;
    private final SectionRepository sectionRepository;
    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final AuditService auditService;

    public AttendanceService(AttendanceSessionRepository sessionRepository,
                             AttendanceRecordRepository recordRepository,
                             SubjectRepository subjectRepository,
                             SectionRepository sectionRepository,
                             ClassroomRepository classroomRepository,
                             UserRepository userRepository,
                             NotificationRepository notificationRepository,
                             AuditService auditService) {
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
        this.subjectRepository = subjectRepository;
        this.sectionRepository = sectionRepository;
        this.classroomRepository = classroomRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.auditService = auditService;
    }

    @Transactional
    public SessionDto startSession(Long facultyId, StartSessionRequest request) {
        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        Classroom classroom = null;
        if (request.getClassroomId() != null) {
            classroom = classroomRepository.findById(request.getClassroomId()).orElse(null);
        }

        // Generate high-entropy opaque temporary QR token
        String qrToken = "CAMPUS-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        int minutes = (request.getDurationMinutes() != null && request.getDurationMinutes() > 0)
                ? request.getDurationMinutes() : 15;
        Instant expiresAt = Instant.now().plus(Duration.ofMinutes(minutes));

        AttendanceSession session = new AttendanceSession();
        session.setFaculty(faculty);
        session.setSubject(subject);
        session.setSection(section);
        session.setClassroom(classroom);
        session.setSessionDate(LocalDate.now());
        session.setStartTime(LocalTime.now());
        session.setEndTime(LocalTime.now().plusMinutes(minutes));
        session.setQrToken(qrToken);
        session.setQrExpiresAt(expiresAt);
        session.setIsActive(true);
        session.setGeofenceEnabled(Boolean.TRUE.equals(request.getGeofenceEnabled()));
        session.setLatitude(request.getLatitude());
        session.setLongitude(request.getLongitude());
        session.setRadiusMeters(request.getRadiusMeters() != null ? request.getRadiusMeters() : 50.0);

        AttendanceSession saved = sessionRepository.save(session);
        auditService.log("ATTENDANCE_SESSION_START", "AttendanceSession", saved.getId().toString(), facultyId,
                "Started session for subject " + subject.getCode() + " with QR token " + qrToken, "127.0.0.1");

        return new SessionDto(saved);
    }

    @Transactional
    public SessionDto closeSession(Long sessionId, Long facultyId) {
        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));

        User currentUser = userRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getRole() != Role.ADMIN && !session.getFaculty().getId().equals(facultyId)) {
            throw new BadRequestException("Unauthorized: You can only close your own attendance sessions.");
        }

        session.setIsActive(false);
        AttendanceSession updated = sessionRepository.save(session);
        auditService.log("ATTENDANCE_SESSION_CLOSE", "AttendanceSession", sessionId.toString(), facultyId,
                "Closed attendance session", "127.0.0.1");

        return new SessionDto(updated);
    }

    @Transactional
    public RecordDto submitCheckIn(Long studentId, CheckInRequest request) {
        AttendanceSession session = sessionRepository.findByQrToken(request.getQrToken().trim())
                .orElseThrow(() -> new BadRequestException("Invalid attendance QR code or session code"));

        if (!Boolean.TRUE.equals(session.getIsActive())) {
            throw new BadRequestException("This attendance session has already been closed by faculty.");
        }

        if (Instant.now().isAfter(session.getQrExpiresAt())) {
            throw new BadRequestException("The QR attendance code has expired.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found"));

        if (recordRepository.existsBySessionIdAndStudentId(session.getId(), studentId)) {
            throw new DuplicateResourceException("You have already checked in for this attendance session.");
        }

        Double distanceMeters = null;
        if (Boolean.TRUE.equals(session.getGeofenceEnabled())) {
            if (request.getLatitude() == null || request.getLongitude() == null) {
                throw new BadRequestException("Geofence is enabled for this session. GPS location coordinates are required.");
            }
            if (session.getLatitude() != null && session.getLongitude() != null) {
                distanceMeters = GeoUtils.calculateDistanceMeters(
                        session.getLatitude().doubleValue(),
                        session.getLongitude().doubleValue(),
                        request.getLatitude().doubleValue(),
                        request.getLongitude().doubleValue()
                );
                if (distanceMeters > session.getRadiusMeters()) {
                    throw new BadRequestException(String.format("Location check failed. You are %.1f meters away (allowed radius: %.1f meters).",
                            distanceMeters, session.getRadiusMeters()));
                }
            }
        }

        AttendanceRecord record = new AttendanceRecord();
        record.setSession(session);
        record.setStudent(student);
        record.setStatus(AttendanceStatus.PRESENT);
        record.setCheckInTime(Instant.now());
        record.setStudentLatitude(request.getLatitude());
        record.setStudentLongitude(request.getLongitude());
        record.setDistanceMeters(distanceMeters);
        record.setRemarks("Verified check-in via dynamic QR");

        AttendanceRecord savedRecord = recordRepository.save(record);

        // Notify student of success
        Notification notif = new Notification(
                student,
                "Attendance Confirmed",
                "You were marked PRESENT for " + session.getSubject().getName() + " (" + session.getSubject().getCode() + ").",
                NotificationType.ATTENDANCE,
                savedRecord.getId()
        );
        notificationRepository.save(notif);

        return new RecordDto(savedRecord);
    }

    public List<RecordDto> getMyRecords(Long studentId) {
        return recordRepository.findByStudentIdOrderByCheckInTimeDesc(studentId).stream()
                .map(RecordDto::new)
                .collect(Collectors.toList());
    }

    public List<RecordDto> getSessionRecords(Long sessionId) {
        return recordRepository.findBySessionId(sessionId).stream()
                .map(RecordDto::new)
                .collect(Collectors.toList());
    }

    public SessionDto getSessionById(Long sessionId) {
        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));
        SessionDto dto = new SessionDto(session);
        dto.setCheckInCount((long) recordRepository.findBySessionId(sessionId).size());
        return dto;
    }

    public List<SessionDto> getFacultySessions(Long facultyId) {
        return sessionRepository.findByFacultyIdOrderByCreatedAtDesc(facultyId).stream()
                .map(s -> {
                    SessionDto dto = new SessionDto(s);
                    dto.setCheckInCount((long) recordRepository.findBySessionId(s.getId()).size());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public AttendanceSummaryDto getStudentSummary(Long studentId) {
        long totalRecords = recordRepository.countByStudentId(studentId);
        long presentRecords = recordRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        long absentRecords = totalRecords - presentRecords;

        double overallPct = totalRecords > 0 ? ((double) presentRecords / totalRecords) * 100.0 : 100.0;

        List<Object[]> rows = recordRepository.getSubjectWiseAttendance(studentId);
        List<AttendanceSummaryDto.SubjectAttendanceDto> subjectSummaries = new ArrayList<>();
        for (Object[] row : rows) {
            Long subId = ((Number) row[0]).longValue();
            String subName = (String) row[1];
            String subCode = (String) row[2];
            long total = ((Number) row[3]).longValue();
            long present = ((Number) row[4]).longValue();
            double pct = total > 0 ? ((double) present / total) * 100.0 : 0.0;
            subjectSummaries.add(new AttendanceSummaryDto.SubjectAttendanceDto(subId, subName, subCode, total, present, Math.round(pct * 10.0) / 10.0));
        }

        return new AttendanceSummaryDto(totalRecords, presentRecords, absentRecords, Math.round(overallPct * 10.0) / 10.0, subjectSummaries);
    }

    public List<RecordDto> getReports(Long sessionId) {
        List<AttendanceRecord> records = (sessionId != null)
                ? recordRepository.findBySessionId(sessionId)
                : recordRepository.findAll();
        return records.stream().map(RecordDto::new).collect(Collectors.toList());
    }

    public String generateCsvReport(Long sessionId) {
        List<AttendanceRecord> records = (sessionId != null)
                ? recordRepository.findBySessionId(sessionId)
                : recordRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("Record ID,Date,Subject,Section,Student Name,College ID,Status,Check-In Time,Distance (m),Remarks\n");
        for (AttendanceRecord r : records) {
            csv.append(String.format("%d,%s,\"%s\",\"%s\",\"%s\",%s,%s,%s,%s,\"%s\"\n",
                    r.getId(),
                    r.getSession().getSessionDate(),
                    r.getSession().getSubject().getName(),
                    r.getSession().getSection().getName(),
                    r.getStudent().getFullName(),
                    r.getStudent().getCollegeId(),
                    r.getStatus(),
                    r.getCheckInTime(),
                    r.getDistanceMeters() != null ? String.format("%.1f", r.getDistanceMeters()) : "N/A",
                    r.getRemarks() != null ? r.getRemarks() : ""
            ));
        }
        return csv.toString();
    }
}
