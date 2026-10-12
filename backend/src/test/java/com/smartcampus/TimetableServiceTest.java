package com.smartcampus;

import com.smartcampus.academics.Subject;
import com.smartcampus.academics.SubjectRepository;
import com.smartcampus.department.Classroom;
import com.smartcampus.department.ClassroomRepository;
import com.smartcampus.department.Section;
import com.smartcampus.department.SectionRepository;
import com.smartcampus.timetable.*;
import com.smartcampus.user.Role;
import com.smartcampus.user.StudentProfileRepository;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TimetableServiceTest {

    @Mock
    private TimetableRepository timetableRepository;
    @Mock
    private SubjectRepository subjectRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SectionRepository sectionRepository;
    @Mock
    private ClassroomRepository classroomRepository;
    @Mock
    private StudentProfileRepository studentProfileRepository;

    @InjectMocks
    private TimetableService timetableService;

    private User faculty;
    private Subject subject;
    private Section section;
    private Classroom classroom;

    @BeforeEach
    void setUp() {
        faculty = new User("fac@campus.edu", "pwd", "Prof Fac", "FAC1", Role.FACULTY);
        faculty.setId(2L);
        subject = new Subject();
        subject.setId(10L);
        subject.setName("Algorithms");
        subject.setCode("CS301");
        section = new Section();
        section.setId(20L);
        section.setName("Sec A");
        classroom = new Classroom();
        classroom.setId(30L);
        classroom.setRoomNumber("LH-101");
    }

    @Test
    void testCreateTimetable_Success() {
        CreateTimetableRequest req = new CreateTimetableRequest();
        req.setSubjectId(10L);
        req.setFacultyId(2L);
        req.setSectionId(20L);
        req.setClassroomId(30L);
        req.setDayOfWeek("MONDAY");
        req.setStartTime(LocalTime.of(9, 0));
        req.setEndTime(LocalTime.of(10, 0));

        when(timetableRepository.findFacultyConflicts(any(), any(), any(), any(), any())).thenReturn(Collections.emptyList());
        when(timetableRepository.findClassroomConflicts(any(), any(), any(), any(), any())).thenReturn(Collections.emptyList());
        when(timetableRepository.findSectionConflicts(any(), any(), any(), any(), any())).thenReturn(Collections.emptyList());

        when(subjectRepository.findById(10L)).thenReturn(Optional.of(subject));
        when(userRepository.findById(2L)).thenReturn(Optional.of(faculty));
        when(sectionRepository.findById(20L)).thenReturn(Optional.of(section));
        when(classroomRepository.findById(30L)).thenReturn(Optional.of(classroom));

        TimetableEntry saved = new TimetableEntry();
        saved.setId(1L);
        saved.setSubject(subject);
        saved.setFaculty(faculty);
        saved.setSection(section);
        saved.setClassroom(classroom);
        saved.setDayOfWeek("MONDAY");
        saved.setStartTime(LocalTime.of(9, 0));
        saved.setEndTime(LocalTime.of(10, 0));

        when(timetableRepository.save(any())).thenReturn(saved);

        TimetableDto dto = timetableService.createTimetableEntry(req);
        assertNotNull(dto);
        assertEquals("CS301", dto.getSubjectCode());
        assertEquals("LH-101", dto.getRoomNumber());
    }

    @Test
    void testCreateTimetable_FacultyConflict_ThrowsException() {
        CreateTimetableRequest req = new CreateTimetableRequest();
        req.setSubjectId(10L);
        req.setFacultyId(2L);
        req.setSectionId(20L);
        req.setClassroomId(30L);
        req.setDayOfWeek("MONDAY");
        req.setStartTime(LocalTime.of(9, 0));
        req.setEndTime(LocalTime.of(10, 0));

        TimetableEntry existing = new TimetableEntry();
        existing.setSubject(subject);
        existing.setClassroom(classroom);
        existing.setStartTime(LocalTime.of(9, 0));
        existing.setEndTime(LocalTime.of(10, 0));

        when(timetableRepository.findFacultyConflicts(eq(2L), eq("MONDAY"), any(), any(), any()))
                .thenReturn(List.of(existing));

        assertThrows(TimetableConflictException.class, () -> timetableService.createTimetableEntry(req));
        verify(timetableRepository, never()).save(any());
    }
}
