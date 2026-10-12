package com.smartcampus.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);

    boolean existsByEventIdAndUserIdAndStatus(Long eventId, Long userId, String status);

    List<EventRegistration> findByEventId(Long eventId);

    List<EventRegistration> findByUserIdOrderByRegisteredAtDesc(Long userId);

    long countByEventIdAndStatus(Long eventId, String status);
}
