package com.smartcampus;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenTest {
    @Test
    void generatePasswords() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH_ADMIN: " + encoder.encode("Admin@123"));
        System.out.println("HASH_FACULTY: " + encoder.encode("Faculty@123"));
        System.out.println("HASH_STUDENT: " + encoder.encode("Student@123"));
    }
}
