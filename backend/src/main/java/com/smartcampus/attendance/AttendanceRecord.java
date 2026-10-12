package com.smartcampus.attendance;

import com.smartcampus.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "attendance_records",
       uniqueConstraints = @UniqueConstraint(name = "uk_session_student", columnNames = {"session_id", "student_id"}))
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private AttendanceSession session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    @Column(name = "check_in_time", nullable = false)
    private Instant checkInTime = Instant.now();

    @Column(name = "student_latitude", precision = 10, scale = 7)
    private BigDecimal studentLatitude;

    @Column(name = "student_longitude", precision = 10, scale = 7)
    private BigDecimal studentLongitude;

    @Column(name = "distance_meters")
    private Double distanceMeters;

    @Column(length = 255)
    private String remarks;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public AttendanceRecord() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AttendanceSession getSession() { return session; }
    public void setSession(AttendanceSession session) { this.session = session; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
    public Instant getCheckInTime() { return checkInTime; }
    public void setCheckInTime(Instant checkInTime) { this.checkInTime = checkInTime; }
    public BigDecimal getStudentLatitude() { return studentLatitude; }
    public void setStudentLatitude(BigDecimal studentLatitude) { this.studentLatitude = studentLatitude; }
    public BigDecimal getStudentLongitude() { return studentLongitude; }
    public void setStudentLongitude(BigDecimal studentLongitude) { this.studentLongitude = studentLongitude; }
    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
