package com.smartcampus.announcements;

import java.time.Instant;

public class AnnouncementDto {
    private Long id;
    private String title;
    private String content;
    private String targetRole;
    private Long authorId;
    private String authorName;
    private AnnouncementPriority priority;
    private Instant createdAt;

    public AnnouncementDto() {}

    public AnnouncementDto(Announcement a) {
        this.id = a.getId();
        this.title = a.getTitle();
        this.content = a.getContent();
        this.targetRole = a.getTargetRole();
        if (a.getAuthor() != null) {
            this.authorId = a.getAuthor().getId();
            this.authorName = a.getAuthor().getFullName();
        }
        this.priority = a.getPriority();
        this.createdAt = a.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public AnnouncementPriority getPriority() { return priority; }
    public void setPriority(AnnouncementPriority priority) { this.priority = priority; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
