package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.SignupResponse;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.model.UserAccountInfo;
import com.example.demo.model.UserLogin;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.util.PasswordUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserMapper userMapper;
    private final PasswordUtils passwordUtils;
    private final JwtTokenProvider jwtTokenProvider;
    
    // 최대 로그인 실패 횟수
    private static final int MAX_FAILED_ATTEMPTS = 5;
    
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
    
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // 이메일로 사용자 찾기
        User user = userMapper.findByEmail(request.getEmail());
        if (user == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Invalid email or password")
                    .build();
        }
        
        // 계정 정보 확인
        UserAccountInfo accountInfo = userMapper.findUserAccountInfoByUserId(user.getUserId());
        if (accountInfo == null || !"Active".equals(accountInfo.getAccountStatus())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Account is not active")
                    .build();
        }
        
        // 로그인 정보 확인
        UserLogin userLogin = userMapper.findUserLoginByUserId(user.getUserId());
        if (userLogin == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Login information not found")
                    .build();
        }
        
        // 계정 잠금 확인
        if (Boolean.TRUE.equals(userLogin.getLoginIsLocked())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Account is locked due to multiple failed login attempts")
                    .build();
        }
        
        // 비밀번호 검증
        boolean isPasswordValid = passwordUtils.verifyPassword(
                request.getPassword(), 
                userLogin.getPasswordHash(), 
                userLogin.getPasswordSalt()
        );
        
        if (!isPasswordValid) {
            // 로그인 실패 횟수 증가
            int failedAttempts = userLogin.getLoginFailedAttempts() + 1;
            userMapper.updateFailedLoginAttempts(user.getUserId(), failedAttempts);
            
            // 최대 실패 횟수 초과 시 계정 잠금
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                userMapper.updateLoginLockStatus(user.getUserId(), true);
                return LoginResponse.builder()
                        .success(false)
                        .message("Account locked due to multiple failed login attempts")
                        .build();
            }
            
            return LoginResponse.builder()
                    .success(false)
                    .message("Invalid email or password")
                    .build();
        }
        
        // 로그인 성공 - 실패 카운트 리셋 및 마지막 로그인 시간 업데이트
        userMapper.updateFailedLoginAttempts(user.getUserId(), 0);
        userMapper.updateLoginTime(user.getUserId());
        
        // 권한 목록 생성
        String role = "ROLE_" + (accountInfo.getAuthorityName() != null ? 
                accountInfo.getAuthorityName().toUpperCase().replace(" ", "_") : "USER");
        
        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(
                user.getUserId(), 
                user.getEmail(),
                Collections.singletonList(role)
        );
        
        return LoginResponse.builder()
                .success(true)
                .token(token)
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .message("Login successful")
                .build();
    }
}
