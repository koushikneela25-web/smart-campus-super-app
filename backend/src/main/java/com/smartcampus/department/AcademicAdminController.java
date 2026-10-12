package com.smartcampus.department;

import com.smartcampus.academics.AcademicService;
import com.smartcampus.academics.SubjectDto;
import com.smartcampus.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Academic Administration", description = "Endpoints for managing departments, courses, sections, classrooms, and subjects")
public class AcademicAdminController {

    private final DepartmentService departmentService;
    private final AcademicService academicService;

    public AcademicAdminController(DepartmentService departmentService, AcademicService academicService) {
        this.departmentService = departmentService;
        this.academicService = academicService;
    }

    @GetMapping("/departments")
    @Operation(summary = "List all departments")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAllDepartments()));
    }

    @GetMapping("/departments/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartment(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getDepartmentById(id)));
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create department (Admin only)")
    public ResponseEntity<ApiResponse<DepartmentDto>> createDepartment(@RequestBody DepartmentDto dto) {
        return ResponseEntity.status(201).body(ApiResponse.success("Department created", departmentService.createDepartment(dto)));
    }

    @GetMapping("/subjects")
    @Operation(summary = "List all subjects")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> getSubjects(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) {
            return ResponseEntity.ok(ApiResponse.success(academicService.getSubjectsByDepartment(departmentId)));
        }
        return ResponseEntity.ok(ApiResponse.success(academicService.getAllSubjects()));
    }

    @PostMapping("/subjects")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create subject (Admin only)")
    public ResponseEntity<ApiResponse<SubjectDto>> createSubject(@RequestBody SubjectDto dto) {
        return ResponseEntity.status(201).body(ApiResponse.success("Subject created", academicService.createSubject(dto)));
    }

    @GetMapping("/sections")
    @Operation(summary = "List all sections")
    public ResponseEntity<ApiResponse<List<SectionDto>>> getSections(@RequestParam(required = false) Long courseId) {
        if (courseId != null) {
            return ResponseEntity.ok(ApiResponse.success(departmentService.getSectionsByCourse(courseId)));
        }
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAllSections()));
    }

    @GetMapping("/classrooms")
    @Operation(summary = "List all classrooms")
    public ResponseEntity<ApiResponse<List<ClassroomDto>>> getClassrooms() {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAllClassrooms()));
    }

    @PostMapping("/classrooms")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create classroom (Admin only)")
    public ResponseEntity<ApiResponse<ClassroomDto>> createClassroom(@RequestBody ClassroomDto dto) {
        return ResponseEntity.status(201).body(ApiResponse.success("Classroom created", departmentService.createClassroom(dto)));
    }
}
