package com.smartcampus.events;

import com.smartcampus.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "event_registrations",
       uniqueConstraints = @UniqueConstraint(name = "uk_event_user", columnNames = {"event_id", "user_id"}))
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private CampusEvent event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String status = "CONFIRMED";

    @Column(name = "registered_at", nullable = false, updatable = false)
    private Instant registeredAt = Instant.now();

    public EventRegistration() {}

    public EventRegistration(CampusEvent event, User user) {
        this.event = event;
        this.user = user;
        this.status = "CONFIRMED";
        this.registeredAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CampusEvent getEvent() { return event; }
    public void setEvent(CampusEvent event) { this.event = event; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getRegisteredAt() { return registeredAt; }
}
