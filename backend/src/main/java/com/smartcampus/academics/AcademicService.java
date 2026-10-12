package com.smartcampus.academics;

import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.common.ResourceNotFoundException;
import com.smartcampus.department.Department;
import com.smartcampus.department.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcademicService {

    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;

    public AcademicService(SubjectRepository subjectRepository, DepartmentRepository departmentRepository) {
        this.subjectRepository = subjectRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(SubjectDto::new)
                .collect(Collectors.toList());
    }

    public List<SubjectDto> getSubjectsByDepartment(Long departmentId) {
        return subjectRepository.findByDepartmentId(departmentId).stream()
                .map(SubjectDto::new)
                .collect(Collectors.toList());
    }

    public SubjectDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return new SubjectDto(subject);
    }

    @Transactional
    public SubjectDto createSubject(SubjectDto dto) {
        if (subjectRepository.findByCode(dto.getCode().trim().toUpperCase()).isPresent()) {
            throw new DuplicateResourceException("Subject with code " + dto.getCode() + " already exists");
        }
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        Subject subject = new Subject();
        subject.setCode(dto.getCode().trim().toUpperCase());
        subject.setName(dto.getName().trim());
        subject.setDepartment(dept);
        subject.setCredits(dto.getCredits() != null ? dto.getCredits() : 3);
        subject.setSemester(dto.getSemester() != null ? dto.getSemester() : 1);

        return new SubjectDto(subjectRepository.save(subject));
    }
}
