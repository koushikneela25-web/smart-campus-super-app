package com.smartcampus;

import com.smartcampus.audit.AuditService;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.lostfound.*;
import com.smartcampus.notifications.NotificationRepository;
import com.smartcampus.user.Role;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LostFoundServiceTest {

    @Mock
    private LostFoundRepository lostFoundRepository;
    @Mock
    private LostFoundClaimRepository claimRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private LostFoundService lostFoundService;

    private User reporter;
    private User studentB;
    private LostFoundItem foundItem;

    @BeforeEach
    void setUp() {
        reporter = new User("reporter@campus.edu", "pwd", "John Reporter", "REP01", Role.STUDENT);
        reporter.setId(10L);

        studentB = new User("other@campus.edu", "pwd", "Alice Other", "STU02", Role.STUDENT);
        studentB.setId(20L);

        foundItem = new LostFoundItem();
        foundItem.setId(100L);
        foundItem.setTitle("Scientific Calculator");
        foundItem.setDescription("Casio fx-991EX blue cover");
        foundItem.setCategory(ItemCategory.ELECTRONICS);
        foundItem.setItemType(ItemType.FOUND);
        foundItem.setLocation("Library 2nd Floor");
        foundItem.setStatus(ItemStatus.FOUND);
        foundItem.setReportedBy(reporter);
    }

    @Test
    void testSubmitClaim_SelfClaim_ThrowsBadRequestException() {
        SubmitClaimRequest req = new SubmitClaimRequest();
        req.setDescriptionProof("It is mine, I reported finding it");

        when(lostFoundRepository.findById(100L)).thenReturn(Optional.of(foundItem));
        when(userRepository.findById(10L)).thenReturn(Optional.of(reporter));

        assertThrows(BadRequestException.class, () -> lostFoundService.submitClaim(100L, 10L, req));
        verify(claimRepository, never()).save(any());
    }

    @Test
    void testGetItemClaims_UnauthorizedStudent_ThrowsBadRequestException() {
        // User 20 is not reporter and not admin
        when(lostFoundRepository.findById(100L)).thenReturn(Optional.of(foundItem));
        when(userRepository.findById(20L)).thenReturn(Optional.of(studentB));

        assertThrows(BadRequestException.class, () -> lostFoundService.getItemClaims(100L, 20L));
        verify(claimRepository, never()).findByItemIdOrderByCreatedAtDesc(any());
    }

    @Test
    void testSubmitClaim_ValidClaimant_Success() {
        SubmitClaimRequest req = new SubmitClaimRequest();
        req.setDescriptionProof("Has my name sticker on back with initials AO");

        when(lostFoundRepository.findById(100L)).thenReturn(Optional.of(foundItem));
        when(userRepository.findById(20L)).thenReturn(Optional.of(studentB));

        LostFoundClaim savedClaim = new LostFoundClaim();
        savedClaim.setId(50L);
        savedClaim.setItem(foundItem);
        savedClaim.setClaimant(studentB);
        savedClaim.setDescriptionProof(req.getDescriptionProof());
        savedClaim.setStatus(ClaimStatus.PENDING);

        when(claimRepository.save(any())).thenReturn(savedClaim);

        ClaimDto result = lostFoundService.submitClaim(100L, 20L, req);

        assertNotNull(result);
        assertEquals(ClaimStatus.PENDING, result.getStatus());
        verify(notificationRepository).save(any());
    }
}
