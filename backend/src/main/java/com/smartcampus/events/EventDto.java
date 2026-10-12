package com.smartcampus.events;

import java.time.Instant;

public class EventDto {
    private Long id;
    private String title;
    private String description;
    private EventCategory category;
    private String venue;
    private Long organizerId;
    private String organizerName;
    private Instant startTime;
    private Instant endTime;
    private Integer maxCapacity;
    private Integer registeredCount;
    private EventStatus status;
    private String imageUrl;
    private Boolean isRegisteredByMe;

    public EventDto() {}

    public EventDto(CampusEvent e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.description = e.getDescription();
        this.category = e.getCategory();
        this.venue = e.getVenue();
        if (e.getOrganizer() != null) {
            this.organizerId = e.getOrganizer().getId();
            this.organizerName = e.getOrganizer().getFullName();
        }
        this.startTime = e.getStartTime();
        this.endTime = e.getEndTime();
        this.maxCapacity = e.getMaxCapacity();
        this.registeredCount = e.getRegisteredCount();
        this.status = e.getStatus();
        this.imageUrl = e.getImageUrl();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public EventCategory getCategory() { return category; }
    public void setCategory(EventCategory category) { this.category = category; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Boolean getIsRegisteredByMe() { return isRegisteredByMe; }
    public void setIsRegisteredByMe(Boolean registeredByMe) { isRegisteredByMe = registeredByMe; }
}
