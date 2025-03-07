package com.example.demo.service;

import com.example.demo.dto.profile.*;
import com.example.demo.dto.hobby.*;
import com.example.demo.dto.auth.*;
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
        
        // 취미 데이터의 유효성 검증 (카테고리->취미 선택 방식)
        if (request.getHobbies() != null && !request.getHobbies().isEmpty()) {
            for (HobbyRequest hobby : request.getHobbies()) {
                // 카테고리 ID가 누락된 경우
                if (hobby.getCategoryId() == null) {
                    return ProfileUpdateResponse.builder()
                            .success(false)
                            .message("카테고리 정보가 누락되었습니다.")
                            .build();
                }
                
                // 취미 ID가 누락된 경우
                if (hobby.getHobbyId() == null) {
                    return ProfileUpdateResponse.builder()
                            .success(false)
                            .message("취미 정보가 누락되었습니다.")
                            .build();
                }
                
                // 취미가 해당 카테고리에 속하는지 검증
                try {
                    boolean isValid = hobbyService.getHobbyMapper().isHobbyInCategory(hobby.getHobbyId(), hobby.getCategoryId());
                    if (!isValid) {
                        return ProfileUpdateResponse.builder()
                                .success(false)
                                .message("선택한 취미가 해당 카테고리에 속하지 않습니다. 취미ID: " + hobby.getHobbyId() + ", 카테고리ID: " + hobby.getCategoryId())
                                .build();
                    }
                } catch (Exception e) {
                    log.error("취미-카테고리 관계 검증 중 오류 발생: {}", e.getMessage());
                    return ProfileUpdateResponse.builder()
                            .success(false)
                            .message("취미 정보 검증 중 오류가 발생했습니다.")
                            .build();
                }
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
            try {
                hobbyService.registerUserHobbies(email, request.getHobbies());
                log.info("프로필 업데이트 - 사용자 취미 등록 완료 - 이메일: {}, 취미 개수: {}", 
                         email, request.getHobbies().size());
            } catch (Exception e) {
                log.error("프로필 업데이트 - 취미 등록 중 오류 발생 - 이메일: {}, 오류: {}", email, e.getMessage());
                // 취미 등록 실패해도 프로필 업데이트는 성공으로 처리
            }
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
    
    /**
     * 마이페이지 정보 조회
     */
    public MyPageResponse getMyPageInfo(String email) {
        // 사용자 기본 정보 조회
        User user = userMapper.findByEmail(email);
        
        if (user == null) {
            return MyPageResponse.builder()
                    .success(false)
                    .message("존재하지 않는 사용자입니다.")
                    .build();
        }
        
        // 프로필 이미지 URL 생성
        String profileImageUrl = profileImageService.getProfileImageUrl(email);
        
        // 마이페이지 응답 구성 (제한된 정보만 포함)
        return MyPageResponse.builder()
                .success(true)
                .message("마이페이지 정보 조회 성공")
                .name(user.getName())
                .nickname(user.getNickname())
                .signupDate(user.getSignupDate())
                .lastLoginTime(user.getLastLoginTime())
                .profileImageUrl(profileImageUrl)
                .accountStatus(user.getAccountStatus())
                .build();
    }
    
    /**
     * 토큰으로 마이페이지 정보 조회
     */
    public MyPageResponse getMyPageInfoByToken(String token) {
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return MyPageResponse.builder()
                    .success(false)
                    .message("유효하지 않은 인증 토큰입니다.")
                    .build();
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        return getMyPageInfo(email);
    }
}
