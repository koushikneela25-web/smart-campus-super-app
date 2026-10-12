package com.smartcampus.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findBySessionId(Long sessionId);

    List<AttendanceRecord> findByStudentIdOrderByCheckInTimeDesc(Long studentId);

    Optional<AttendanceRecord> findBySessionIdAndStudentId(Long sessionId, Long studentId);

    boolean existsBySessionIdAndStudentId(Long sessionId, Long studentId);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    @Query("SELECT r.session.subject.id, r.session.subject.name, r.session.subject.code, " +
           "COUNT(r.id), SUM(CASE WHEN r.status = 'PRESENT' THEN 1 ELSE 0 END) " +
           "FROM AttendanceRecord r WHERE r.student.id = :studentId " +
           "GROUP BY r.session.subject.id, r.session.subject.name, r.session.subject.code")
    List<Object[]> getSubjectWiseAttendance(Long studentId);

    long countByStatus(AttendanceStatus status);
}
