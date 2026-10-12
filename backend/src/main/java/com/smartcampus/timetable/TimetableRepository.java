package com.smartcampus.timetable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {

    List<TimetableEntry> findBySectionIdOrderByDayOfWeekAscStartTimeAsc(Long sectionId);

    List<TimetableEntry> findByFacultyIdOrderByDayOfWeekAscStartTimeAsc(Long facultyId);

    List<TimetableEntry> findBySectionIdAndDayOfWeekOrderByStartTimeAsc(Long sectionId, String dayOfWeek);

    List<TimetableEntry> findByFacultyIdAndDayOfWeekOrderByStartTimeAsc(Long facultyId, String dayOfWeek);

    // Overlap conflict detection for Faculty
    @Query("SELECT t FROM TimetableEntry t WHERE t.faculty.id = :facultyId " +
           "AND t.dayOfWeek = :dayOfWeek " +
           "AND (:id IS NULL OR t.id <> :id) " +
           "AND NOT (t.endTime <= :startTime OR t.startTime >= :endTime)")
    List<TimetableEntry> findFacultyConflicts(Long facultyId, String dayOfWeek, LocalTime startTime, LocalTime endTime, Long id);

    // Overlap conflict detection for Classroom
    @Query("SELECT t FROM TimetableEntry t WHERE t.classroom.id = :classroomId " +
           "AND t.dayOfWeek = :dayOfWeek " +
           "AND (:id IS NULL OR t.id <> :id) " +
           "AND NOT (t.endTime <= :startTime OR t.startTime >= :endTime)")
    List<TimetableEntry> findClassroomConflicts(Long classroomId, String dayOfWeek, LocalTime startTime, LocalTime endTime, Long id);

    // Overlap conflict detection for Section
    @Query("SELECT t FROM TimetableEntry t WHERE t.section.id = :sectionId " +
           "AND t.dayOfWeek = :dayOfWeek " +
           "AND (:id IS NULL OR t.id <> :id) " +
           "AND NOT (t.endTime <= :startTime OR t.startTime >= :endTime)")
    List<TimetableEntry> findSectionConflicts(Long sectionId, String dayOfWeek, LocalTime startTime, LocalTime endTime, Long id);
}
