package com.smartcampus.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

    Optional<AttendanceSession> findByQrToken(String qrToken);

    List<AttendanceSession> findByFacultyIdOrderByCreatedAtDesc(Long facultyId);

    List<AttendanceSession> findBySectionIdOrderByCreatedAtDesc(Long sectionId);

    List<AttendanceSession> findByFacultyIdAndIsActiveTrue(Long facultyId);

    List<AttendanceSession> findBySessionDate(LocalDate sessionDate);
}
