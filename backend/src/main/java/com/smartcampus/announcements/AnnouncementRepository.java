package com.smartcampus.announcements;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByOrderByCreatedAtDesc();

    @Query("SELECT a FROM Announcement a WHERE a.targetRole = 'ALL' OR a.targetRole = :role ORDER BY a.createdAt DESC")
    List<Announcement> findForRole(String role);

    List<Announcement> findTop5ByOrderByCreatedAtDesc();
}
