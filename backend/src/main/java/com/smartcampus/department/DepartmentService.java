package com.smartcampus.department;

import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final ClassroomRepository classroomRepository;

    public DepartmentService(DepartmentRepository departmentRepository,
                             CourseRepository courseRepository,
                             SectionRepository sectionRepository,
                             ClassroomRepository classroomRepository) {
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.classroomRepository = classroomRepository;
    }

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentDto::new)
                .collect(Collectors.toList());
    }

    public DepartmentDto getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return new DepartmentDto(dept);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.existsByCode(dto.getCode().trim().toUpperCase())) {
            throw new DuplicateResourceException("Department with code " + dto.getCode() + " already exists");
        }
        Department dept = new Department(dto.getCode().trim().toUpperCase(), dto.getName().trim(), dto.getDescription());
        return new DepartmentDto(departmentRepository.save(dept));
    }

    public List<CourseDto> getCoursesByDepartment(Long departmentId) {
        return courseRepository.findByDepartmentId(departmentId).stream()
                .map(CourseDto::new)
                .collect(Collectors.toList());
    }

    public List<SectionDto> getSectionsByCourse(Long courseId) {
        return sectionRepository.findByCourseId(courseId).stream()
                .map(SectionDto::new)
                .collect(Collectors.toList());
    }

    public List<SectionDto> getAllSections() {
        return sectionRepository.findAll().stream()
                .map(SectionDto::new)
                .collect(Collectors.toList());
    }

    public List<ClassroomDto> getAllClassrooms() {
        return classroomRepository.findAll().stream()
                .map(ClassroomDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClassroomDto createClassroom(ClassroomDto dto) {
        if (classroomRepository.existsByRoomNumber(dto.getRoomNumber().trim().toUpperCase())) {
            throw new DuplicateResourceException("Classroom with room number " + dto.getRoomNumber() + " already exists");
        }
        Classroom classroom = new Classroom();
        classroom.setRoomNumber(dto.getRoomNumber().trim().toUpperCase());
        classroom.setBuilding(dto.getBuilding().trim());
        classroom.setCapacity(dto.getCapacity() != null ? dto.getCapacity() : 60);
        return new ClassroomDto(classroomRepository.save(classroom));
    }
}
