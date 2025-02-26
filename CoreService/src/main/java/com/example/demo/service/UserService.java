package com.example.demo.service;

import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.SignupResponse;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.model.UserAccountInfo;
import com.example.demo.model.UserLogin;
import com.example.demo.util.PasswordUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserMapper userMapper;
    private final PasswordUtils passwordUtils;
    
    @Transactional
    public SignupResponse registerUser(SignupRequest request) {
        // Check if user already exists
        User existingUserByEmail = userMapper.findByEmail(request.getEmail());
        if (existingUserByEmail != null) {
            return SignupResponse.builder()
                    .success(false)
                    .message("Email already in use")
                    .build();
        }
        
        User existingUserByNickname = userMapper.findByNickname(request.getNickname());
        if (existingUserByNickname != null) {
            return SignupResponse.builder()
                    .success(false)
                    .message("Nickname already in use")
                    .build();
        }
        
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            User existingUserByPhone = userMapper.findByPhoneNumber(request.getPhoneNumber());
            if (existingUserByPhone != null) {
                return SignupResponse.builder()
                        .success(false)
                        .message("Phone number already in use")
                        .build();
            }
        }
        
        // Create user
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .nickname(request.getNickname())
                .bio(request.getBio())
                .signupDate(now)
                .lastUpdateDate(now)
                .lastLoginTime(now)
                .build();
        
        // Insert user and get generated ID
        userMapper.insertUser(user);
        
        // Create user login info
        String salt = passwordUtils.generateSalt();
        Map<String, String> passwordInfo = passwordUtils.hashPassword(request.getPassword(), salt);
        
        UserLogin userLogin = UserLogin.builder()
                .userId(user.getUserId())
                .passwordHash(passwordInfo.get("hashedPassword"))
                .passwordSalt(salt)
                .loginMethod(request.getLoginMethod() != null ? request.getLoginMethod() : "EMAIL")
                .socialProvider(request.getSocialProvider())
                .userLastLoginAt(now)
                .loginFailedAttempts(0)
                .loginIsLocked(false)
                .build();
        
        userMapper.insertUserLogin(userLogin);
        
        // Create user account info
        UserAccountInfo accountInfo = UserAccountInfo.builder()
                .userId(user.getUserId())
                .accountStatus("Active")
                .authority("1")  // Default to regular user
                .authorityName("Regular User")
                .build();
        
        userMapper.insertUserAccountInfo(accountInfo);
        
        return SignupResponse.builder()
                .success(true)
                .userId(user.getUserId())
                .message("User registered successfully")
                .build();
    }
}
