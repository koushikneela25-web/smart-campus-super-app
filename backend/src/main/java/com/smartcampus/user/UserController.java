package com.smartcampus.user;

import com.smartcampus.common.ApiResponse;
import com.smartcampus.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Profile", description = "Current authenticated user profile endpoints")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get profile of the currently logged-in user")
    public ResponseEntity<ApiResponse<UserDto>> getMyProfile() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(currentUserId)));
    }

    @PatchMapping("/me")
    @Operation(summary = "Update profile details of current user")
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        UserDto updated = userService.updateProfile(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
