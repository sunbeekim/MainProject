package com.example.demo.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class PasswordUtils {
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * 솔트 생성
     */
    public String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
    
    /**
     * 비밀번호 해싱
     */
    public Map<String, String> hashPassword(String password, String salt) {
        Map<String, String> result = new HashMap<>();
        String saltedPassword = password + salt;
        String hashedPassword = passwordEncoder.encode(saltedPassword);
        
        result.put("hashedPassword", hashedPassword);
        result.put("salt", salt);
        return result;
    }
    
    /**
     * 비밀번호 검증
     */
    public boolean verifyPassword(String inputPassword, String storedHash, String salt) {
        String saltedInput = inputPassword + salt;
        return passwordEncoder.matches(saltedInput, storedHash);
    }
}
