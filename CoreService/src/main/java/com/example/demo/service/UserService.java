package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.LogoutResponse;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.SignupResponse;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.model.UserAccountInfo;
import com.example.demo.model.UserLogin;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.util.PasswordUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Map;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserMapper userMapper;
    private final PasswordUtils passwordUtils;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenBlacklistService jwtTokenBlacklistService;
    
    // 최대 로그인 실패 횟수
    private static final int MAX_FAILED_ATTEMPTS = 5;
    
    @Transactional
    public SignupResponse registerUser(SignupRequest request) {
        // Check if user already exists
        User existingUserByEmail = userMapper.findByEmail(request.getEmail());
        if (existingUserByEmail != null) {
            return SignupResponse.builder()
                    .success(false)
                    .message("중복된 이메일 입니다.")
                    .build();
        }
        
        User existingUserByNickname = userMapper.findByNickname(request.getNickname());
        if (existingUserByNickname != null) {
            return SignupResponse.builder()
                    .success(false)
                    .message("중복된 닉네임 입니다.")
                    .build();
        }
        
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            User existingUserByPhone = userMapper.findByPhoneNumber(request.getPhoneNumber());
            if (existingUserByPhone != null) {
                return SignupResponse.builder()
                        .success(false)
                        .message("중복된 전화번호입니다.")
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
                .message("회원가입이 완료되었습니다.")
                .build();
    }
    
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // 이메일로 사용자 찾기
        User user = userMapper.findByEmail(request.getEmail());
        if (user == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("잘못된 이메일 또는 비밀번호입니다.")
                    .build();
        }
        
        // 계정 정보 확인
        UserAccountInfo accountInfo = userMapper.findUserAccountInfoByUserId(user.getUserId());
        if (accountInfo == null || !"Active".equals(accountInfo.getAccountStatus())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("활성화된 계정이 아닙니다.")
                    .build();
        }
        
        // 로그인 정보 확인
        UserLogin userLogin = userMapper.findUserLoginByUserId(user.getUserId());
        if (userLogin == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("로그인 정보를 찾을 수 없습니다.")
                    .build();
        }
        
        // 계정 잠금 확인
        if (Boolean.TRUE.equals(userLogin.getLoginIsLocked())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("반복된 로그인 실패로 계정이 잠금되었습니다.")
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
                        .message("반복된 로그인 실패로 계정이 잠금되었습니다.")
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
    
    /**
     * 로그아웃 메소드
     */
    @Transactional
    public LogoutResponse logout(String token) {
        if (token == null || token.isEmpty()) {
            log.warn("Logout attempt with no token provided");
            return LogoutResponse.builder()
                    .success(false)
                    .message("No token provided")
                    .build();
        }
        
        try {
            // 토큰에서 JWT 부분만 추출
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            // 토큰 검증
            if (!jwtTokenProvider.validateToken(token)) {
                log.warn("Logout attempt with invalid token");
                return LogoutResponse.builder()
                        .success(false)
                        .message("Invalid token")
                        .build();
            }
            
            // 이미 블랙리스트에 있는지 확인
            if (jwtTokenBlacklistService.isBlacklisted(token)) {
                log.info("Token already in blacklist during logout");
                return LogoutResponse.builder()
                        .success(true)
                        .message("Already logged out")
                        .build();
            }
            
            // JWT의 만료 시간 가져오기
            Date expiration = jwtTokenProvider.getExpirationDate(token);
            Long expiryMillis = expiration.getTime();
            
            // 토큰 블랙리스트에 추가
            jwtTokenBlacklistService.addToBlacklist(token, expiryMillis);
            
            // 로그아웃 시간을 LocalDateTime으로 변환
            LocalDateTime expiryDateTime = LocalDateTime.ofInstant(
                    expiration.toInstant(), ZoneId.systemDefault());
            
            // 사용자 ID 로깅
            Integer userId = jwtTokenProvider.getUserId(token);
            log.info("User ID {} successfully logged out", userId);
            
            return LogoutResponse.builder()
                    .success(true)
                    .message("Successfully logged out")
                    .invalidatedUntil(expiryDateTime)
                    .build();
        } catch (Exception e) {
            log.error("Error during logout process", e);
            return LogoutResponse.builder()
                    .success(false)
                    .message("Logout failed: " + e.getMessage())
                    .build();
        }
    }
}
