package com.smartcampus.lostfound;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundClaimRepository extends JpaRepository<LostFoundClaim, Long> {

    List<LostFoundClaim> findByItemIdOrderByCreatedAtDesc(Long itemId);

    List<LostFoundClaim> findByClaimantIdOrderByCreatedAtDesc(Long claimantId);

    List<LostFoundClaim> findByStatus(ClaimStatus status);

    long countByStatus(ClaimStatus status);
}
