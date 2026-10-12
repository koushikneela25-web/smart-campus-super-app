package com.smartcampus.common;

import com.smartcampus.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return principal;
        }
        throw new BadRequestException("No authenticated user found in session");
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
