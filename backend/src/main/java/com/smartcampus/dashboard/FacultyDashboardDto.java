package com.smartcampus.dashboard;

import com.smartcampus.announcements.AnnouncementDto;
import com.smartcampus.attendance.SessionDto;
import com.smartcampus.events.EventDto;
import com.smartcampus.timetable.TimetableDto;
import com.smartcampus.user.UserDto;

import java.util.List;

public class FacultyDashboardDto {
    private UserDto profile;
    private List<TimetableDto> todayClasses;
    private TimetableDto nextClass;
    private List<SessionDto> activeSessions;
    private List<SessionDto> recentSessions;
    private List<EventDto> upcomingEvents;
    private List<AnnouncementDto> recentAnnouncements;
    private long totalClassesTaught;

    public FacultyDashboardDto() {}

    public UserDto getProfile() { return profile; }
    public void setProfile(UserDto profile) { this.profile = profile; }
    public List<TimetableDto> getTodayClasses() { return todayClasses; }
    public void setTodayClasses(List<TimetableDto> todayClasses) { this.todayClasses = todayClasses; }
    public TimetableDto getNextClass() { return nextClass; }
    public void setNextClass(TimetableDto nextClass) { this.nextClass = nextClass; }
    public List<SessionDto> getActiveSessions() { return activeSessions; }
    public void setActiveSessions(List<SessionDto> activeSessions) { this.activeSessions = activeSessions; }
    public List<SessionDto> getRecentSessions() { return recentSessions; }
    public void setRecentSessions(List<SessionDto> recentSessions) { this.recentSessions = recentSessions; }
    public List<EventDto> getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(List<EventDto> upcomingEvents) { this.upcomingEvents = upcomingEvents; }
    public List<AnnouncementDto> getRecentAnnouncements() { return recentAnnouncements; }
    public void setRecentAnnouncements(List<AnnouncementDto> recentAnnouncements) { this.recentAnnouncements = recentAnnouncements; }
    public long getTotalClassesTaught() { return totalClassesTaught; }
    public void setTotalClassesTaught(long totalClassesTaught) { this.totalClassesTaught = totalClassesTaught; }
}
