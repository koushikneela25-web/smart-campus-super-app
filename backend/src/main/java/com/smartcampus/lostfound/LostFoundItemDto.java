package com.smartcampus.lostfound;

import java.time.Instant;
import java.time.LocalDate;

public class LostFoundItemDto {
    private Long id;
    private String title;
    private String description;
    private ItemCategory category;
    private ItemType itemType;
    private String location;
    private LocalDate dateRecorded;
    private ItemStatus status;
    private Long reportedById;
    private String reportedByName;
    private String imageUrl;
    private Instant createdAt;

    public LostFoundItemDto() {}

    public LostFoundItemDto(LostFoundItem item) {
        this.id = item.getId();
        this.title = item.getTitle();
        this.description = item.getDescription();
        this.category = item.getCategory();
        this.itemType = item.getItemType();
        this.location = item.getLocation();
        this.dateRecorded = item.getDateRecorded();
        this.status = item.getStatus();
        if (item.getReportedBy() != null) {
            this.reportedById = item.getReportedBy().getId();
            this.reportedByName = item.getReportedBy().getFullName();
        }
        this.imageUrl = item.getImageUrl();
        this.createdAt = item.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
    public ItemType getItemType() { return itemType; }
    public void setItemType(ItemType itemType) { this.itemType = itemType; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getDateRecorded() { return dateRecorded; }
    public void setDateRecorded(LocalDate dateRecorded) { this.dateRecorded = dateRecorded; }
    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }
    public Long getReportedById() { return reportedById; }
    public void setReportedById(Long reportedById) { this.reportedById = reportedById; }
    public String getReportedByName() { return reportedByName; }
    public void setReportedByName(String reportedByName) { this.reportedByName = reportedByName; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
