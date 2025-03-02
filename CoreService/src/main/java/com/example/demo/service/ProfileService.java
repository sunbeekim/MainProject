package com.example.demo.service;

import com.example.demo.dto.ProfileResponse;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.Hobby;
import com.example.demo.model.User;
import com.example.demo.model.UserLocation;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenBlacklistService blacklistService;

    /**
     * 현재 로그인한 사용자의 프로필 조회
     */
    public ProfileResponse getMyProfile(String token) {
        if (token == null || token.isEmpty()) {
            log.warn("Profile request with empty token");
            return createErrorResponse("인증 정보가 없습니다.");
        }
        
        try {
            // Bearer 접두사 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            log.debug("Processing token for profile request");
            
            // 토큰 검증
            if (!jwtTokenProvider.validateToken(token)) {
                log.warn("Invalid token in profile request");
                return createErrorResponse("유효하지 않은 인증 정보입니다.");
            }
            
            // 블랙리스트 확인
            if (blacklistService.isBlacklisted(token)) {
                log.warn("Blacklisted token in profile request");
                return createErrorResponse("로그아웃된 토큰입니다.");
            }
            
            // 토큰에서 이메일 추출 (현재 시스템에서는 email을 주 식별자로 사용)
            String email = jwtTokenProvider.getUsername(token);
            
            // 상세 프로필 조회
            return getDetailedProfile(email);
        } catch (Exception e) {
            log.error("Error in getMyProfile: {}", e.getMessage(), e);
            return createErrorResponse("프로필 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 특정 사용자의 프로필 조회 (다른 사용자 조회)
     */
    public ProfileResponse getUserProfile(String email) {
        try {
            // 프로필 공개 범위를 제한한 정보 조회
            return getPublicProfile(email);
        } catch (Exception e) {
            log.error("Error in getUserProfile: {}", e.getMessage(), e);
            return createErrorResponse("프로필 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 상세 프로필 정보 조회 (본인용)
     */
    private ProfileResponse getDetailedProfile(String email) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            return createErrorResponse("사용자를 찾을 수 없습니다.");
        }
        
        // 취미 정보 조회
        List<Hobby> hobbies = userMapper.findHobbiesByEmail(email);
        List<String> hobbyNames = hobbies.stream()
                .map(Hobby::getHobbyName)
                .collect(Collectors.toList());
        
        List<String> hobbyCategories = hobbies.stream()
                .map(Hobby::getCategory)
                .distinct()
                .collect(Collectors.toList());
        
        // 위치 정보 조회
        UserLocation location = userMapper.findLocationByEmail(email);
        
        // 응답 객체 구성
        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .success(true)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .nickname(user.getNickname())
                .phoneNumber(user.getPhoneNumber())
                .bio(user.getBio())
                .hobbies(hobbyNames)
                .hobbyCategories(hobbyCategories)
                .signupDate(user.getSignupDate())
                .lastLoginTime(user.getLastLoginTime())
                .accountStatus(user.getAccountStatus());
        
        // 위치 정보가 있는 경우 추가
        if (location != null) {
            builder.locationName(location.getLocationName())
                  .latitude(location.getLatitude())
                  .longitude(location.getLongitude());
        }
        
        log.info("Retrieved detailed profile for user email: {}", email);
        return builder.build();
    }
    
    /**
     * 공개 프로필 정보 조회 (다른 사용자용)
     */
    private ProfileResponse getPublicProfile(String email) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            return createErrorResponse("사용자를 찾을 수 없습니다.");
        }
        
        if (!"Active".equals(user.getAccountStatus())) {
            return createErrorResponse("비활성화된 계정입니다.");
        }
        
        // 취미 정보 조회 (공개 정보)
        List<Hobby> hobbies = userMapper.findHobbiesByEmail(email);
        List<String> hobbyNames = hobbies.stream()
                .map(Hobby::getHobbyName)
                .collect(Collectors.toList());
        
        // 위치 정보 조회 (공개 정보)
        UserLocation location = userMapper.findLocationByEmail(email);
        
        // 공개 범위를 제한한 정보로만 응답 구성
        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .success(true)
                .userId(user.getId())
                .nickname(user.getNickname())
                .bio(user.getBio())
                .hobbies(hobbyNames);
                
        // 위치는 이름만 공개 정보로 제공 (상세 좌표는 제외)
        if (location != null) {
            builder.locationName(location.getLocationName());
        }
        
        log.info("Retrieved public profile for user email: {}", email);
        return builder.build();
    }
    
    private ProfileResponse createErrorResponse(String message) {
        return ProfileResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
