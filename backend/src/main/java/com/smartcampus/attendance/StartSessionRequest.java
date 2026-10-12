package com.smartcampus.attendance;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class StartSessionRequest {

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Section ID is required")
    private Long sectionId;

    private Long classroomId;
    private Integer durationMinutes = 15;
    private Boolean geofenceEnabled = false;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Double radiusMeters = 50.0;

    public StartSessionRequest() {}

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public Long getSectionId() { return sectionId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    public Long getClassroomId() { return classroomId; }
    public void setClassroomId(Long classroomId) { this.classroomId = classroomId; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Boolean getGeofenceEnabled() { return geofenceEnabled; }
    public void setGeofenceEnabled(Boolean geofenceEnabled) { this.geofenceEnabled = geofenceEnabled; }
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    public Double getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(Double radiusMeters) { this.radiusMeters = radiusMeters; }
}
