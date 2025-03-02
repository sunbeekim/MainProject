package com.example.demo.service;

import com.example.demo.dto.ProfileResponse;
import com.example.demo.dto.ProfileUpdateRequest;
import com.example.demo.dto.ProfileUpdateResponse;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.Hobby;
import com.example.demo.model.User;
import com.example.demo.model.UserLocation;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    
    /**
     * 사용자 프로필 업데이트
     */
    @Transactional
    public ProfileUpdateResponse updateProfile(String token, ProfileUpdateRequest request) {
        // 토큰 검증 및 이메일 추출
        if (token == null || token.isEmpty()) {
            return createUpdateErrorResponse("인증 정보가 없습니다.");
        }
        
        try {
            // Bearer 접두사 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            // 토큰 검증
            if (!jwtTokenProvider.validateToken(token)) {
                return createUpdateErrorResponse("유효하지 않은 인증 정보입니다.");
            }
            
            // 블랙리스트 확인
            if (blacklistService.isBlacklisted(token)) {
                return createUpdateErrorResponse("로그아웃된 토큰입니다.");
            }
            
            // 토큰에서 이메일 추출
            String email = jwtTokenProvider.getUsername(token);
            
            // 사용자 찾기
            User user = userMapper.findByEmail(email);
            if (user == null) {
                return createUpdateErrorResponse("사용자를 찾을 수 없습니다.");
            }

            // 닉네임 중복 확인 (변경하는 경우)
            if (request.getNickname() != null && !request.getNickname().equals(user.getNickname())) {
                User existingUserWithNickname = userMapper.findByNickname(request.getNickname());
                if (existingUserWithNickname != null) {
                    return createUpdateErrorResponse("이미 사용 중인 닉네임입니다.");
                }
            }
            
            // 전화번호 중복 확인 (변경하는 경우)
            if (request.getPhoneNumber() != null && !request.getPhoneNumber().equals(user.getPhoneNumber())) {
                User existingUserWithPhone = userMapper.findByPhoneNumber(request.getPhoneNumber());
                if (existingUserWithPhone != null) {
                    return createUpdateErrorResponse("이미 등록된 전화번호입니다.");
                }
            }

            // 사용자 기본 정보 업데이트
            boolean userUpdated = false;
            if (request.getName() != null && !request.getName().isEmpty()) {
                user.setName(request.getName());
                userUpdated = true;
            }
            
            if (request.getNickname() != null && !request.getNickname().isEmpty()) {
                user.setNickname(request.getNickname());
                userUpdated = true;
            }
            
            if (request.getPhoneNumber() != null) {
                user.setPhoneNumber(request.getPhoneNumber());
                userUpdated = true;
            }
            
            if (request.getBio() != null) {
                user.setBio(request.getBio());
                userUpdated = true;
            }
            
            if (userUpdated) {
                user.setLastUpdateDate(LocalDateTime.now());
                userMapper.updateUser(user);
            }
            
            // 취미 정보 업데이트
            if (request.getHobbyIds() != null && !request.getHobbyIds().isEmpty()) {
                // 기존 취미 삭제
                userMapper.deleteUserHobbies(email);
                
                // 새 취미 등록
                for (Integer hobbyId : request.getHobbyIds()) {
                    userMapper.insertUserHobby(email, hobbyId);
                }
            }
            
            // 위치 정보 업데이트
            if (request.getLocationName() != null && !request.getLocationName().isEmpty()) {
                UserLocation location = userMapper.findLocationByEmail(email);
                
                if (location == null) {
                    // 새 위치 정보 생성
                    location = UserLocation.builder()
                        .email(email)
                        .locationName(request.getLocationName())
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .recordedAt(LocalDateTime.now())
                        .build();
                    
                    userMapper.insertUserLocation(location);
                } else {
                    // 기존 위치 정보 업데이트
                    location.setLocationName(request.getLocationName());
                    location.setLatitude(request.getLatitude());
                    location.setLongitude(request.getLongitude());
                    location.setRecordedAt(LocalDateTime.now());
                    
                    userMapper.updateUserLocation(location);
                }
            }
            
            return ProfileUpdateResponse.builder()
                    .success(true)
                    .email(email)
                    .message("프로필이 성공적으로 업데이트되었습니다.")
                    .build();
            
        } catch (Exception e) {
            log.error("프로필 업데이트 중 오류 발생: {}", e.getMessage(), e);
            return createUpdateErrorResponse("프로필 업데이트 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    private ProfileUpdateResponse createUpdateErrorResponse(String message) {
        return ProfileUpdateResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
    
    private ProfileResponse createErrorResponse(String message) {
        return ProfileResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
