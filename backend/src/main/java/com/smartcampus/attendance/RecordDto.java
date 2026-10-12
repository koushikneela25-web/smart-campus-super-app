package com.smartcampus.attendance;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class RecordDto {
    private Long id;
    private Long sessionId;
    private String subjectCode;
    private String subjectName;
    private Long studentId;
    private String studentName;
    private String collegeId;
    private AttendanceStatus status;
    private Instant checkInTime;
    private LocalDate sessionDate;
    private BigDecimal studentLatitude;
    private BigDecimal studentLongitude;
    private Double distanceMeters;
    private String remarks;

    public RecordDto() {}

    public RecordDto(AttendanceRecord r) {
        this.id = r.getId();
        if (r.getSession() != null) {
            this.sessionId = r.getSession().getId();
            this.sessionDate = r.getSession().getSessionDate();
            if (r.getSession().getSubject() != null) {
                this.subjectCode = r.getSession().getSubject().getCode();
                this.subjectName = r.getSession().getSubject().getName();
            }
        }
        if (r.getStudent() != null) {
            this.studentId = r.getStudent().getId();
            this.studentName = r.getStudent().getFullName();
            this.collegeId = r.getStudent().getCollegeId();
        }
        this.status = r.getStatus();
        this.checkInTime = r.getCheckInTime();
        this.studentLatitude = r.getStudentLatitude();
        this.studentLongitude = r.getStudentLongitude();
        this.distanceMeters = r.getDistanceMeters();
        this.remarks = r.getRemarks();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getCollegeId() { return collegeId; }
    public void setCollegeId(String collegeId) { this.collegeId = collegeId; }
    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
    public Instant getCheckInTime() { return checkInTime; }
    public void setCheckInTime(Instant checkInTime) { this.checkInTime = checkInTime; }
    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }
    public BigDecimal getStudentLatitude() { return studentLatitude; }
    public void setStudentLatitude(BigDecimal studentLatitude) { this.studentLatitude = studentLatitude; }
    public BigDecimal getStudentLongitude() { return studentLongitude; }
    public void setStudentLongitude(BigDecimal studentLongitude) { this.studentLongitude = studentLongitude; }
    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
