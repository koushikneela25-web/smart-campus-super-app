package com.smartcampus.timetable;

import com.smartcampus.academics.Subject;
import com.smartcampus.academics.SubjectRepository;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.ResourceNotFoundException;
import com.smartcampus.department.Classroom;
import com.smartcampus.department.ClassroomRepository;
import com.smartcampus.department.Section;
import com.smartcampus.department.SectionRepository;
import com.smartcampus.user.Role;
import com.smartcampus.user.StudentProfile;
import com.smartcampus.user.StudentProfileRepository;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final SectionRepository sectionRepository;
    private final ClassroomRepository classroomRepository;
    private final StudentProfileRepository studentProfileRepository;

    public TimetableService(TimetableRepository timetableRepository,
                            SubjectRepository subjectRepository,
                            UserRepository userRepository,
                            SectionRepository sectionRepository,
                            ClassroomRepository classroomRepository,
                            StudentProfileRepository studentProfileRepository) {
        this.timetableRepository = timetableRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.sectionRepository = sectionRepository;
        this.classroomRepository = classroomRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    public List<TimetableDto> getAllTimetableEntries(Long sectionId, Long facultyId) {
        if (sectionId != null) {
            return timetableRepository.findBySectionIdOrderByDayOfWeekAscStartTimeAsc(sectionId).stream()
                    .map(TimetableDto::new)
                    .collect(Collectors.toList());
        }
        if (facultyId != null) {
            return timetableRepository.findByFacultyIdOrderByDayOfWeekAscStartTimeAsc(facultyId).stream()
                    .map(TimetableDto::new)
                    .collect(Collectors.toList());
        }
        return timetableRepository.findAll().stream()
                .map(TimetableDto::new)
                .collect(Collectors.toList());
    }

    public List<TimetableDto> getMyTimetable(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUserId(userId)
                    .orElse(null);
            if (profile != null && profile.getSection() != null) {
                return timetableRepository.findBySectionIdOrderByDayOfWeekAscStartTimeAsc(profile.getSection().getId()).stream()
                        .map(TimetableDto::new)
                        .collect(Collectors.toList());
            }
            // If student profile not linked, return section 1 as sensible fallback
            return timetableRepository.findBySectionIdOrderByDayOfWeekAscStartTimeAsc(1L).stream()
                    .map(TimetableDto::new)
                    .collect(Collectors.toList());
        } else if (user.getRole() == Role.FACULTY) {
            return timetableRepository.findByFacultyIdOrderByDayOfWeekAscStartTimeAsc(userId).stream()
                    .map(TimetableDto::new)
                    .collect(Collectors.toList());
        } else {
            // ADMIN sees all entries
            return timetableRepository.findAll().stream()
                    .map(TimetableDto::new)
                    .collect(Collectors.toList());
        }
    }

    @Transactional
    public TimetableDto createTimetableEntry(CreateTimetableRequest request) {
        validateConflict(null, request);

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        User faculty = userRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        TimetableEntry entry = new TimetableEntry();
        entry.setSubject(subject);
        entry.setFaculty(faculty);
        entry.setSection(section);
        entry.setClassroom(classroom);
        entry.setDayOfWeek(request.getDayOfWeek().trim().toUpperCase());
        entry.setStartTime(request.getStartTime());
        entry.setEndTime(request.getEndTime());

        return new TimetableDto(timetableRepository.save(entry));
    }

    @Transactional
    public TimetableDto updateTimetableEntry(Long id, CreateTimetableRequest request) {
        TimetableEntry entry = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable entry not found with id: " + id));

        validateConflict(id, request);

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        User faculty = userRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        entry.setSubject(subject);
        entry.setFaculty(faculty);
        entry.setSection(section);
        entry.setClassroom(classroom);
        entry.setDayOfWeek(request.getDayOfWeek().trim().toUpperCase());
        entry.setStartTime(request.getStartTime());
        entry.setEndTime(request.getEndTime());

        return new TimetableDto(timetableRepository.save(entry));
    }

    @Transactional
    public void deleteTimetableEntry(Long id) {
        if (!timetableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Timetable entry not found with id: " + id);
        }
        timetableRepository.deleteById(id);
    }

    private void validateConflict(Long entryId, CreateTimetableRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Start time (" + request.getStartTime() + ") must be before end time (" + request.getEndTime() + ")");
        }

        String day = request.getDayOfWeek().trim().toUpperCase();

        // 1. Check Faculty Conflict
        List<TimetableEntry> facultyConflicts = timetableRepository.findFacultyConflicts(
                request.getFacultyId(), day, request.getStartTime(), request.getEndTime(), entryId);
        if (!facultyConflicts.isEmpty()) {
            TimetableEntry conflict = facultyConflicts.get(0);
            throw new TimetableConflictException(
                    "Faculty conflict: The assigned faculty is already scheduled for " +
                    conflict.getSubject().getName() + " in " + conflict.getClassroom().getRoomNumber() +
                    " on " + day + " from " + conflict.getStartTime() + " to " + conflict.getEndTime());
        }

        // 2. Check Classroom Conflict
        List<TimetableEntry> classroomConflicts = timetableRepository.findClassroomConflicts(
                request.getClassroomId(), day, request.getStartTime(), request.getEndTime(), entryId);
        if (!classroomConflicts.isEmpty()) {
            TimetableEntry conflict = classroomConflicts.get(0);
            throw new TimetableConflictException(
                    "Classroom conflict: Room " + conflict.getClassroom().getRoomNumber() +
                    " is already occupied by " + conflict.getSection().getName() +
                    " (" + conflict.getSubject().getName() + ") on " + day +
                    " from " + conflict.getStartTime() + " to " + conflict.getEndTime());
        }

        // 3. Check Section Conflict
        List<TimetableEntry> sectionConflicts = timetableRepository.findSectionConflicts(
                request.getSectionId(), day, request.getStartTime(), request.getEndTime(), entryId);
        if (!sectionConflicts.isEmpty()) {
            TimetableEntry conflict = sectionConflicts.get(0);
            throw new TimetableConflictException(
                    "Section conflict: " + conflict.getSection().getName() +
                    " already has a scheduled class (" + conflict.getSubject().getName() +
                    ") on " + day + " from " + conflict.getStartTime() + " to " + conflict.getEndTime());
        }
    }
}
