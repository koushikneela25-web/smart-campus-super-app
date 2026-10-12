package com.smartcampus.department;

public class CourseDto {
    private Long id;
    private String code;
    private String name;
    private Long departmentId;
    private String departmentName;
    private Integer credits;

    public CourseDto() {}
    public CourseDto(Course c) {
        this.id = c.getId();
        this.code = c.getCode();
        this.name = c.getName();
        if (c.getDepartment() != null) {
            this.departmentId = c.getDepartment().getId();
            this.departmentName = c.getDepartment().getName();
        }
        this.credits = c.getCredits();
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
}
