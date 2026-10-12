package com.smartcampus.attendance;

import java.util.List;

public class AttendanceSummaryDto {
    private long totalSessions;
    private long presentCount;
    private long absentCount;
    private double overallPercentage;
    private List<SubjectAttendanceDto> subjectSummaries;

    public AttendanceSummaryDto() {}

    public AttendanceSummaryDto(long totalSessions, long presentCount, long absentCount,
                                double overallPercentage, List<SubjectAttendanceDto> subjectSummaries) {
        this.totalSessions = totalSessions;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.overallPercentage = overallPercentage;
        this.subjectSummaries = subjectSummaries;
    }

    public long getTotalSessions() { return totalSessions; }
    public void setTotalSessions(long totalSessions) { this.totalSessions = totalSessions; }
    public long getPresentCount() { return presentCount; }
    public void setPresentCount(long presentCount) { this.presentCount = presentCount; }
    public long getAbsentCount() { return absentCount; }
    public void setAbsentCount(long absentCount) { this.absentCount = absentCount; }
    public double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; }
    public List<SubjectAttendanceDto> getSubjectSummaries() { return subjectSummaries; }
    public void setSubjectSummaries(List<SubjectAttendanceDto> subjectSummaries) { this.subjectSummaries = subjectSummaries; }

    public static class SubjectAttendanceDto {
        private Long subjectId;
        private String subjectName;
        private String subjectCode;
        private long totalClasses;
        private long attendedClasses;
        private double percentage;

        public SubjectAttendanceDto() {}

        public SubjectAttendanceDto(Long subjectId, String subjectName, String subjectCode,
                                    long totalClasses, long attendedClasses, double percentage) {
            this.subjectId = subjectId;
            this.subjectName = subjectName;
            this.subjectCode = subjectCode;
            this.totalClasses = totalClasses;
            this.attendedClasses = attendedClasses;
            this.percentage = percentage;
        }

        public Long getSubjectId() { return subjectId; }
        public String getSubjectName() { return subjectName; }
        public String getSubjectCode() { return subjectCode; }
        public long getTotalClasses() { return totalClasses; }
        public long getAttendedClasses() { return attendedClasses; }
        public double getPercentage() { return percentage; }
    }
}
