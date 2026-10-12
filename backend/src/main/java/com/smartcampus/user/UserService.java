package com.smartcampus.user;

import com.smartcampus.audit.AuditService;
import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.common.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        User saved = userRepository.save(user);
        auditService.log("USER_UPDATE_PROFILE", "User", saved.getId().toString(), userId,
                "Updated personal profile information", "127.0.0.1");

        return new UserDto(saved);
    }

    public List<UserDto> getAllUsers(Role role) {
        if (role != null) {
            return userRepository.findByRole(role).stream()
                    .map(UserDto::new)
                    .collect(Collectors.toList());
        }
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request, Long adminId) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("User with email " + request.getEmail() + " already exists");
        }
        if (userRepository.existsByCollegeId(request.getCollegeId().trim().toUpperCase())) {
            throw new DuplicateResourceException("User with College ID " + request.getCollegeId() + " already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setCollegeId(request.getCollegeId().trim().toUpperCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);
        user.setPhoneNumber(request.getPhoneNumber());

        User saved = userRepository.save(user);
        auditService.log("ADMIN_CREATE_USER", "User", saved.getId().toString(), adminId,
                "Created user " + saved.getEmail() + " with role " + saved.getRole(), "127.0.0.1");

        return new UserDto(saved);
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, UserStatus status, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(status);
        User saved = userRepository.save(user);
        auditService.log("ADMIN_UPDATE_STATUS", "User", saved.getId().toString(), adminId,
                "Updated status to " + status, "127.0.0.1");

        return new UserDto(saved);
    }
}
