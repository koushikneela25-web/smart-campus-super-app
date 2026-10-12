package com.smartcampus;

import com.smartcampus.audit.AuditService;
import com.smartcampus.auth.AuthResponse;
import com.smartcampus.auth.AuthService;
import com.smartcampus.auth.LoginRequest;
import com.smartcampus.auth.RegisterRequest;
import com.smartcampus.common.BadRequestException;
import com.smartcampus.common.DuplicateResourceException;
import com.smartcampus.security.JwtTokenProvider;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.user.Role;
import com.smartcampus.user.User;
import com.smartcampus.user.UserRepository;
import com.smartcampus.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("student@campus.edu", "hashed_pwd", "Student Test", "STU100", Role.STUDENT);
        sampleUser.setId(1L);
        sampleUser.setStatus(UserStatus.ACTIVE);
    }

    @Test
    void testLogin_Success() {
        LoginRequest req = new LoginRequest("student@campus.edu", "Password@123");
        UserPrincipal principal = UserPrincipal.create(sampleUser);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(authToken);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateAccessToken(any())).thenReturn("mock_access_token");
        when(tokenProvider.generateRefreshToken(1L)).thenReturn("mock_refresh_token");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponse res = authService.login(req, "127.0.0.1");

        assertNotNull(res);
        assertEquals("mock_access_token", res.getAccessToken());
        assertEquals("student@campus.edu", res.getUser().getEmail());
        verify(auditService).log(eq("LOGIN_SUCCESS"), eq("User"), eq("1"), eq(1L), anyString(), anyString());
    }

    @Test
    void testRegister_RejectAdminRole() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("fakeadmin@campus.edu");
        req.setRole(Role.ADMIN);
        req.setFullName("Fake Admin");
        req.setPassword("Admin@123");
        req.setCollegeId("ADM999");

        assertThrows(BadRequestException.class, () -> authService.register(req, "127.0.0.1"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_DuplicateEmail_ThrowsException() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@campus.edu");
        req.setRole(Role.STUDENT);
        req.setFullName("Existing User");
        req.setPassword("Password@123");
        req.setCollegeId("STU999");

        when(userRepository.existsByEmail("existing@campus.edu")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(req, "127.0.0.1"));
        verify(userRepository, never()).save(any());
    }
}
