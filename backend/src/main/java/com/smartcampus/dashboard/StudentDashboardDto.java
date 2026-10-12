package com.smartcampus.dashboard;

import com.smartcampus.announcements.AnnouncementDto;
import com.smartcampus.attendance.AttendanceSummaryDto;
import com.smartcampus.events.EventDto;
import com.smartcampus.timetable.TimetableDto;
import com.smartcampus.user.UserDto;

import java.util.List;

public class StudentDashboardDto {
    private UserDto profile;
    private AttendanceSummaryDto attendance;
    private List<TimetableDto> todayTimetable;
    private TimetableDto nextClass;
    private List<EventDto> upcomingEvents;
    private List<AnnouncementDto> recentAnnouncements;
    private long unreadNotificationsCount;

    public StudentDashboardDto() {}

    public UserDto getProfile() { return profile; }
    public void setProfile(UserDto profile) { this.profile = profile; }
    public AttendanceSummaryDto getAttendance() { return attendance; }
    public void setAttendance(AttendanceSummaryDto attendance) { this.attendance = attendance; }
    public List<TimetableDto> getTodayTimetable() { return todayTimetable; }
    public void setTodayTimetable(List<TimetableDto> todayTimetable) { this.todayTimetable = todayTimetable; }
    public TimetableDto getNextClass() { return nextClass; }
    public void setNextClass(TimetableDto nextClass) { this.nextClass = nextClass; }
    public List<EventDto> getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(List<EventDto> upcomingEvents) { this.upcomingEvents = upcomingEvents; }
    public List<AnnouncementDto> getRecentAnnouncements() { return recentAnnouncements; }
    public void setRecentAnnouncements(List<AnnouncementDto> recentAnnouncements) { this.recentAnnouncements = recentAnnouncements; }
    public long getUnreadNotificationsCount() { return unreadNotificationsCount; }
    public void setUnreadNotificationsCount(long unreadNotificationsCount) { this.unreadNotificationsCount = unreadNotificationsCount; }
}
