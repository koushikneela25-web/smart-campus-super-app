package com.smartcampus.auth;

import com.smartcampus.audit.AuditService;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.common.ResourceNotFoundException;
import com.smartcampus.security.JwtTokenProvider;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.user.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        // Authenticate with Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier().trim(), request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Account is inactive or suspended. Please contact administrator.");
        }

        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        auditService.log("LOGIN_SUCCESS", "User", user.getId().toString(), user.getId(), "User logged in successfully", ipAddress);

        return new AuthResponse(accessToken, refreshToken, tokenProvider.getExpirationMs(), new UserDto(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String ipAddress) {
        // Enforce RBAC security rule: Never allow self-registration as ADMIN
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Self-registration as ADMIN is strictly prohibited.");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists.");
        }

        if (userRepository.existsByCollegeId(request.getCollegeId().trim().toUpperCase())) {
            throw new DuplicateResourceException("An account with College ID " + request.getCollegeId() + " already exists.");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setCollegeId(request.getCollegeId().trim().toUpperCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);
        user.setPhoneNumber(request.getPhoneNumber());

        User savedUser = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getId());

        auditService.log("USER_REGISTER", "User", savedUser.getId().toString(), savedUser.getId(), "New user self-registered with role: " + savedUser.getRole(), ipAddress);

        return new AuthResponse(accessToken, refreshToken, tokenProvider.getExpirationMs(), new UserDto(savedUser));
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        Long userId = tokenProvider.getUserIdFromToken(request.getRefreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Account is not active");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(principal);
        String newRefreshToken = tokenProvider.generateRefreshToken(userId);

        return new AuthResponse(newAccessToken, newRefreshToken, tokenProvider.getExpirationMs(), new UserDto(user));
    }
}
