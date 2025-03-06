package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.model.UserHobby;
import com.example.demo.util.PasswordUtils;
import com.example.demo.util.TokenUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserMapper userMapper;
    private final HobbyService hobbyService;
    private final PasswordUtils passwordUtils;
    private final TokenUtils tokenUtils;
    private final ProfileImageService profileImageService;

    /**
     * 사용자 프로필 조회
     */
    public ProfileResponse getUserProfile(String email) {
        // 사용자 기본 정보 조회
        User user = userMapper.findByEmail(email);
        
        if (user == null) {
            return ProfileResponse.builder()
                    .success(false)
                    .message("존재하지 않는 사용자입니다.")
                    .build();
        }
        
        // 사용자 취미 정보 조회
        List<UserHobby> userHobbies = hobbyService.getUserHobbies(email);
        List<ProfileResponse.HobbyInfo> hobbyInfoList = userHobbies.stream()
                .map(ProfileResponse.HobbyInfo::fromUserHobby)
                .collect(Collectors.toList());
        
        // 프로필 이미지 URL 생성
        String profileImageUrl = profileImageService.getProfileImageUrl(email);
        
        // 프로필 응답 구성
        return ProfileResponse.builder()
                .success(true)
                .message("프로필 조회 성공")
                .email(user.getEmail())
                .name(user.getName())
                .nickname(user.getNickname())
                .phoneNumber(user.getPhoneNumber())
                .profileImageUrl(profileImageUrl)
                .bio(user.getBio())
                .loginMethod(user.getLoginMethod())
                .accountStatus(user.getAccountStatus())
                .signupDate(user.getSignupDate())
                .lastLoginTime(user.getLastLoginTime())
                .hobbies(hobbyInfoList)
                .build();
    }
    
    /**
     * 토큰으로 사용자 프로필 조회
     */
    public ProfileResponse getUserProfileByToken(String token) {
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ProfileResponse.builder()
                    .success(false)
                    .message("유효하지 않은 인증 토큰입니다.")
                    .build();
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        return getUserProfile(email);
    }
    
    /**
     * 닉네임으로 사용자 프로필 조회 (공개 정보만)
     */
    public ProfileResponse getPublicProfile(String nickname) {
        // 닉네임으로 사용자 조회
        User user = userMapper.findByNickname(nickname);
        
        if (user == null) {
            return ProfileResponse.builder()
                    .success(false)
                    .message("존재하지 않는 사용자입니다.")
                    .build();
        }
        
        // 계정이 활성 상태인지 확인
        if (!"Active".equals(user.getAccountStatus())) {
            return ProfileResponse.builder()
                    .success(false)
                    .message("비활성화된 계정입니다.")
                    .build();
        }
        
        // 취미 정보 조회
        List<UserHobby> userHobbies = hobbyService.getUserHobbies(user.getEmail());
        List<ProfileResponse.HobbyInfo> hobbyInfoList = userHobbies.stream()
                .map(ProfileResponse.HobbyInfo::fromUserHobby)
                .collect(Collectors.toList());
        
        // 프로필 이미지 URL 생성
        String profileImageUrl = profileImageService.getProfileImageUrl(user.getEmail());
        
        // 공개 프로필만 반환 (민감한 정보 제외)
        return ProfileResponse.builder()
                .success(true)
                .message("프로필 조회 성공")
                .nickname(user.getNickname())
                .profileImageUrl(profileImageUrl)
                .bio(user.getBio())
                .hobbies(hobbyInfoList)
                .build();
    }
    
    /**
     * 사용자 프로필 업데이트
     */
    @Transactional
    public ProfileUpdateResponse updateProfile(String email, ProfileUpdateRequest request) {
        // 사용자 존재 여부 확인
        User user = userMapper.findByEmail(email);
        if (user == null) {
            return ProfileUpdateResponse.builder()
                    .success(false)
                    .message("존재하지 않는 사용자입니다.")
                    .build();
        }
        
        // 닉네임 중복 체크 (변경된 경우에만)
        if (StringUtils.hasText(request.getNickname()) && !request.getNickname().equals(user.getNickname())) {
            User existingUser = userMapper.findByNicknameExceptEmail(request.getNickname(), email);
            if (existingUser != null) {
                return ProfileUpdateResponse.builder()
                        .success(false)
                        .message("이미 사용 중인 닉네임입니다.")
                        .build();
            }
        }
                
        // 프로필 정보 업데이트
        User updatedUser = User.builder()
                .email(email)
                .name(request.getName() != null ? request.getName() : user.getName())
                .nickname(request.getNickname() != null ? request.getNickname() : user.getNickname())
                .phoneNumber(user.getPhoneNumber()) // 전화번호는 변경 불가
                .bio(request.getBio() != null ? request.getBio() : user.getBio())
                .lastUpdateDate(LocalDateTime.now())
                .build();
        
        userMapper.updateUserProfile(updatedUser);
        
        // 취미 정보 업데이트 (요청에 포함된 경우)
        if (request.getHobbies() != null && !request.getHobbies().isEmpty()) {
            hobbyService.registerUserHobbies(email, request.getHobbies());
        }
        
        // 업데이트된 프로필 정보 조회
        ProfileResponse updatedProfile = getUserProfile(email);
        
        return ProfileUpdateResponse.builder()
                .success(true)
                .message("프로필이 성공적으로 업데이트되었습니다.")
                .updatedProfile(updatedProfile)
                .build();
    }
    
    /**
     * 토큰을 통한 사용자 프로필 업데이트
     */
    public ProfileUpdateResponse updateProfileByToken(String token, ProfileUpdateRequest request) {
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ProfileUpdateResponse.builder()
                    .success(false)
                    .message("유효하지 않은 인증 토큰입니다.")
                    .build();
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        return updateProfile(email, request);
    }
    
    /**
     * 비밀번호 변경
     */
    @Transactional
    public PasswordChangeResponse changePassword(String email, PasswordChangeRequest request) {
        // 사용자 존재 여부 확인
        User user = userMapper.findByEmail(email);
        if (user == null) {
            return PasswordChangeResponse.builder()
                    .success(false)
                    .message("존재하지 않는 사용자입니다.")
                    .build();
        }
        
        // 현재 비밀번호 확인
        boolean isCurrentPasswordValid = passwordUtils.verifyPassword(
                request.getCurrentPassword(),
                user.getPasswordHash(),
                null
        );
        
        if (!isCurrentPasswordValid) {
            return PasswordChangeResponse.builder()
                    .success(false)
                    .message("현재 비밀번호가 일치하지 않습니다.")
                    .build();
        }
        
        // 새 비밀번호와 확인 비밀번호 일치 확인
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return PasswordChangeResponse.builder()
                    .success(false)
                    .message("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.")
                    .build();
        }
        
        // 비밀번호 변경
        String newPasswordHash = passwordUtils.hashPassword(request.getNewPassword(), null).get("hashedPassword");
        userMapper.updateUserPasswordHash(email, newPasswordHash);
        
        return PasswordChangeResponse.builder()
                .success(true)
                .message("비밀번호가 성공적으로 변경되었습니다.")
                .build();
    }
    
    /**
     * 토큰을 통한 비밀번호 변경
     */
    public PasswordChangeResponse changePasswordByToken(String token, PasswordChangeRequest request) {
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return PasswordChangeResponse.builder()
                    .success(false)
                    .message("유효하지 않은 인증 토큰입니다.")
                    .build();
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        return changePassword(email, request);
    }
}
