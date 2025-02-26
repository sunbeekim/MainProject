package com.example.demo.util;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class PasswordUtils {

    private final PasswordEncoder passwordEncoder;

    public PasswordUtils(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public Map<String, String> hashPassword(String password, String salt) {
        Map<String, String> result = new HashMap<>();
        String passwordWithSalt = password + salt;
        String hashedPassword = passwordEncoder.encode(passwordWithSalt);
        result.put("hashedPassword", hashedPassword);
        return result;
    }

    public boolean verifyPassword(String password, String salt, String hashedPassword) {
        String passwordWithSalt = password + salt;
        return passwordEncoder.matches(passwordWithSalt, hashedPassword);
    }
}
