package com.smartcampus.academics;

public class SubjectDto {
    private Long id;
    private String code;
    private String name;
    private Long departmentId;
    private String departmentName;
    private Integer credits;
    private Integer semester;

    public SubjectDto() {}
    public SubjectDto(Subject s) {
        this.id = s.getId();
        this.code = s.getCode();
        this.name = s.getName();
        if (s.getDepartment() != null) {
            this.departmentId = s.getDepartment().getId();
            this.departmentName = s.getDepartment().getName();
        }
        this.credits = s.getCredits();
        this.semester = s.getSemester();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
}
