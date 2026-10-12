package com.smartcampus.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<CampusEvent, Long> {

    List<CampusEvent> findByOrderByStartTimeAsc();

    List<CampusEvent> findByStatusOrderByStartTimeAsc(EventStatus status);

    List<CampusEvent> findByCategoryOrderByStartTimeAsc(EventCategory category);

    @Query("SELECT e FROM CampusEvent e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.startTime ASC")
    List<CampusEvent> searchEvents(EventCategory category, EventStatus status, String search);

    long countByStatus(EventStatus status);
}
