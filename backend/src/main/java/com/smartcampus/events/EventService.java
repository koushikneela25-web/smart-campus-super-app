package com.smartcampus.events;

import com.smartcampus.audit.AuditService;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.common.ResourceNotFoundException;
import com.smartcampus.notifications.Notification;
import com.smartcampus.notifications.NotificationRepository;
import com.smartcampus.notifications.NotificationType;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final AuditService auditService;

    public EventService(EventRepository eventRepository,
                        EventRegistrationRepository registrationRepository,
                        UserRepository userRepository,
                        NotificationRepository notificationRepository,
                        AuditService auditService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.auditService = auditService;
    }

    public List<EventDto> getEvents(EventCategory category, EventStatus status, String search, Long currentUserId) {
        List<CampusEvent> events = eventRepository.searchEvents(category, status, search);
        return events.stream().map(e -> {
            EventDto dto = new EventDto(e);
            if (currentUserId != null) {
                dto.setIsRegisteredByMe(registrationRepository.existsByEventIdAndUserIdAndStatus(e.getId(), currentUserId, "CONFIRMED"));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public EventDto getEventById(Long eventId, Long currentUserId) {
        CampusEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        EventDto dto = new EventDto(event);
        if (currentUserId != null) {
            dto.setIsRegisteredByMe(registrationRepository.existsByEventIdAndUserIdAndStatus(event.getId(), currentUserId, "CONFIRMED"));
        }
        return dto;
    }

    @Transactional
    public EventDto createEvent(Long organizerId, CreateEventRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Event start time must be before end time");
        }

        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer user not found"));

        CampusEvent event = new CampusEvent();
        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription().trim());
        event.setCategory(request.getCategory());
        event.setVenue(request.getVenue().trim());
        event.setOrganizer(organizer);
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setMaxCapacity(request.getMaxCapacity() != null ? request.getMaxCapacity() : 100);
        event.setRegisteredCount(0);
        event.setStatus(EventStatus.UPCOMING);
        event.setImageUrl(request.getImageUrl());

        CampusEvent saved = eventRepository.save(event);
        auditService.log("EVENT_CREATE", "CampusEvent", saved.getId().toString(), organizerId,
                "Created campus event: " + saved.getTitle(), "127.0.0.1");

        return new EventDto(saved);
    }

    @Transactional
    public EventDto updateEvent(Long eventId, Long userId, CreateEventRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Event start time must be before end time");
        }

        CampusEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription().trim());
        event.setCategory(request.getCategory());
        event.setVenue(request.getVenue().trim());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        if (request.getMaxCapacity() != null) {
            event.setMaxCapacity(request.getMaxCapacity());
        }
        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl());
        }

        CampusEvent saved = eventRepository.save(event);
        auditService.log("EVENT_UPDATE", "CampusEvent", saved.getId().toString(), userId,
                "Updated campus event: " + saved.getTitle(), "127.0.0.1");

        return new EventDto(saved);
    }

    @Transactional
    public void rsvpEvent(Long eventId, Long userId) {
        CampusEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new BadRequestException("Registration is closed. Event status is " + event.getStatus());
        }

        Optional<EventRegistration> existing = registrationRepository.findByEventIdAndUserId(eventId, userId);
        if (existing.isPresent() && "CONFIRMED".equals(existing.get().getStatus())) {
            throw new DuplicateResourceException("You are already registered for this event.");
        }

        if (event.getRegisteredCount() >= event.getMaxCapacity()) {
            throw new BadRequestException("Event is fully booked. Maximum capacity (" + event.getMaxCapacity() + ") reached.");
        }

        if (existing.isPresent()) {
            EventRegistration reg = existing.get();
            reg.setStatus("CONFIRMED");
            registrationRepository.save(reg);
        } else {
            EventRegistration reg = new EventRegistration(event, user);
            registrationRepository.save(reg);
        }

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        // Send confirmation notification
        Notification notif = new Notification(
                user,
                "Event RSVP Confirmed: " + event.getTitle(),
                "Your registration for " + event.getTitle() + " at " + event.getVenue() + " has been confirmed.",
                NotificationType.EVENT,
                event.getId()
        );
        notificationRepository.save(notif);
    }

    @Transactional
    public void cancelRsvp(Long eventId, Long userId) {
        EventRegistration registration = registrationRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new BadRequestException("No registration found for this event"));

        if (!"CONFIRMED".equals(registration.getStatus())) {
            throw new BadRequestException("Registration is not active");
        }

        registration.setStatus("CANCELLED");
        registrationRepository.save(registration);

        CampusEvent event = registration.getEvent();
        if (event.getRegisteredCount() > 0) {
            event.setRegisteredCount(event.getRegisteredCount() - 1);
            eventRepository.save(event);
        }
    }
}
