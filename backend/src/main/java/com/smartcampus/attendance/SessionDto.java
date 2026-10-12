package com.smartcampus.attendance;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public class SessionDto {
    private Long id;
    private Long facultyId;
    private String facultyName;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private Long sectionId;
    private String sectionName;
    private Long classroomId;
    private String roomNumber;
    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String qrToken;
    private Instant qrExpiresAt;
    private Boolean isActive;
    private Boolean geofenceEnabled;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Double radiusMeters;
    private Long checkInCount;

    public SessionDto() {}

    public SessionDto(AttendanceSession s) {
        this.id = s.getId();
        if (s.getFaculty() != null) {
            this.facultyId = s.getFaculty().getId();
            this.facultyName = s.getFaculty().getFullName();
        }
        if (s.getSubject() != null) {
            this.subjectId = s.getSubject().getId();
            this.subjectCode = s.getSubject().getCode();
            this.subjectName = s.getSubject().getName();
        }
        if (s.getSection() != null) {
            this.sectionId = s.getSection().getId();
            this.sectionName = s.getSection().getName();
        }
        if (s.getClassroom() != null) {
            this.classroomId = s.getClassroom().getId();
            this.roomNumber = s.getClassroom().getRoomNumber();
        }
        this.sessionDate = s.getSessionDate();
        this.startTime = s.getStartTime();
        this.endTime = s.getEndTime();
        this.qrToken = s.getQrToken();
        this.qrExpiresAt = s.getQrExpiresAt();
        this.isActive = s.getIsActive();
        this.geofenceEnabled = s.getGeofenceEnabled();
        this.latitude = s.getLatitude();
        this.longitude = s.getLongitude();
        this.radiusMeters = s.getRadiusMeters();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }
    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public Long getSectionId() { return sectionId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public Long getClassroomId() { return classroomId; }
    public void setClassroomId(Long classroomId) { this.classroomId = classroomId; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public Instant getQrExpiresAt() { return qrExpiresAt; }
    public void setQrExpiresAt(Instant qrExpiresAt) { this.qrExpiresAt = qrExpiresAt; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
    public Boolean getGeofenceEnabled() { return geofenceEnabled; }
    public void setGeofenceEnabled(Boolean geofenceEnabled) { this.geofenceEnabled = geofenceEnabled; }
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    public Double getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(Double radiusMeters) { this.radiusMeters = radiusMeters; }
    public Long getCheckInCount() { return checkInCount; }
    public void setCheckInCount(Long checkInCount) { this.checkInCount = checkInCount; }
}
