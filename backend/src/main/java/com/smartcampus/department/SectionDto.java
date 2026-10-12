package com.smartcampus.department;

public class SectionDto {
    private Long id;
    private String name;
    private Long courseId;
    private String courseName;
    private Integer semester;
    private String academicYear;

    public SectionDto() {}
    public SectionDto(Section s) {
        this.id = s.getId();
        this.name = s.getName();
        if (s.getCourse() != null) {
            this.courseId = s.getCourse().getId();
            this.courseName = s.getCourse().getName();
        }
        this.semester = s.getSemester();
        this.academicYear = s.getAcademicYear();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
