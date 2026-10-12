package com.smartcampus.timetable;

import java.time.LocalTime;

public class TimetableDto {
    private Long id;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private Long facultyId;
    private String facultyName;
    private Long sectionId;
    private String sectionName;
    private Long classroomId;
    private String roomNumber;
    private String building;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;

    public TimetableDto() {}

    public TimetableDto(TimetableEntry t) {
        this.id = t.getId();
        if (t.getSubject() != null) {
            this.subjectId = t.getSubject().getId();
            this.subjectCode = t.getSubject().getCode();
            this.subjectName = t.getSubject().getName();
        }
        if (t.getFaculty() != null) {
            this.facultyId = t.getFaculty().getId();
            this.facultyName = t.getFaculty().getFullName();
        }
        if (t.getSection() != null) {
            this.sectionId = t.getSection().getId();
            this.sectionName = t.getSection().getName();
        }
        if (t.getClassroom() != null) {
            this.classroomId = t.getClassroom().getId();
            this.roomNumber = t.getClassroom().getRoomNumber();
            this.building = t.getClassroom().getBuilding();
        }
        this.dayOfWeek = t.getDayOfWeek();
        this.startTime = t.getStartTime();
        this.endTime = t.getEndTime();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }
    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }
    public Long getSectionId() { return sectionId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public Long getClassroomId() { return classroomId; }
    public void setClassroomId(Long classroomId) { this.classroomId = classroomId; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}
