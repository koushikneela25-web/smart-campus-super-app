package com.smartcampus.announcements;

import com.smartcampus.audit.AuditService;
import com.smartcampus.common.ResourceNotFoundException;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               UserRepository userRepository,
                               AuditService auditService) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public List<AnnouncementDto> getAnnouncementsForRole(String role) {
        if (role == null || role.isEmpty()) {
            return announcementRepository.findByOrderByCreatedAtDesc().stream()
                    .map(AnnouncementDto::new)
                    .collect(Collectors.toList());
        }
        return announcementRepository.findForRole(role).stream()
                .map(AnnouncementDto::new)
                .collect(Collectors.toList());
    }

    public List<AnnouncementDto> getAllAnnouncements() {
        return announcementRepository.findByOrderByCreatedAtDesc().stream()
                .map(AnnouncementDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public AnnouncementDto createAnnouncement(Long authorId, CreateAnnouncementRequest request) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author user not found"));

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle().trim());
        announcement.setContent(request.getContent().trim());
        announcement.setTargetRole(request.getTargetRole() != null ? request.getTargetRole().trim().toUpperCase() : "ALL");
        announcement.setAuthor(author);
        announcement.setPriority(request.getPriority());

        Announcement saved = announcementRepository.save(announcement);
        auditService.log("ANNOUNCEMENT_CREATE", "Announcement", saved.getId().toString(), authorId,
                "Published announcement: " + saved.getTitle(), "127.0.0.1");

        return new AnnouncementDto(saved);
    }
}
