package com.smartcampus.dashboard;

import com.smartcampus.audit.AuditLog;
import com.smartcampus.events.EventDto;

import java.util.List;
import java.util.Map;

public class AdminDashboardDto {
    private long totalStudents;
    private long totalFaculty;
    private long totalUsers;
    private long activeUsers;
    private long totalDepartments;
    private long totalSubjects;
    private long totalClassrooms;
    private long upcomingEventsCount;
    private long pendingLostFoundCount;
    private long totalAttendanceRecords;
    private List<EventDto> upcomingEvents;
    private List<AuditLog> recentAuditLogs;
    private List<Map<String, Object>> attendanceChartData;

    public AdminDashboardDto() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalFaculty() { return totalFaculty; }
    public void setTotalFaculty(long totalFaculty) { this.totalFaculty = totalFaculty; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }
    public long getTotalSubjects() { return totalSubjects; }
    public void setTotalSubjects(long totalSubjects) { this.totalSubjects = totalSubjects; }
    public long getTotalClassrooms() { return totalClassrooms; }
    public void setTotalClassrooms(long totalClassrooms) { this.totalClassrooms = totalClassrooms; }
    public long getUpcomingEventsCount() { return upcomingEventsCount; }
    public void setUpcomingEventsCount(long upcomingEventsCount) { this.upcomingEventsCount = upcomingEventsCount; }
    public long getPendingLostFoundCount() { return pendingLostFoundCount; }
    public void setPendingLostFoundCount(long pendingLostFoundCount) { this.pendingLostFoundCount = pendingLostFoundCount; }
    public long getTotalAttendanceRecords() { return totalAttendanceRecords; }
    public void setTotalAttendanceRecords(long totalAttendanceRecords) { this.totalAttendanceRecords = totalAttendanceRecords; }
    public List<EventDto> getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(List<EventDto> upcomingEvents) { this.upcomingEvents = upcomingEvents; }
    public List<AuditLog> getRecentAuditLogs() { return recentAuditLogs; }
    public void setRecentAuditLogs(List<AuditLog> recentAuditLogs) { this.recentAuditLogs = recentAuditLogs; }
    public List<Map<String, Object>> getAttendanceChartData() { return attendanceChartData; }
    public void setAttendanceChartData(List<Map<String, Object>> attendanceChartData) { this.attendanceChartData = attendanceChartData; }
}
