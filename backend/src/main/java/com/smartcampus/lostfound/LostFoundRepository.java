package com.smartcampus.lostfound;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundRepository extends JpaRepository<LostFoundItem, Long> {

    List<LostFoundItem> findByOrderByCreatedAtDesc();

    List<LostFoundItem> findByReportedByIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT i FROM LostFoundItem i WHERE " +
           "(:type IS NULL OR i.itemType = :type) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:query IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY i.createdAt DESC")
    List<LostFoundItem> searchItems(ItemType type, ItemCategory category, ItemStatus status, String query);

    long countByStatus(ItemStatus status);
}
