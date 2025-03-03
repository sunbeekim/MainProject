package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.model.UserHobby;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.util.PasswordUtils;
import com.example.demo.util.RandomUtils;
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
public class UserService {
    private final AuthService authService;
    private final HobbyService hobbyService;
    private final UserMapper userMapper;
    private final TokenUtils tokenUtils;
    private final PasswordUtils passwordUtils;
    private final JwtTokenBlacklistService jwtTokenBlacklistService;
    private final JwtTokenProvider jwtTokenProvider;

    public SignupResponse registerUser(SignupRequest request) {
        return authService.registerUser(request);
    }

    public LoginResponse login(LoginRequest request) {
        return authService.login(request);
    }

    public LogoutResponse logout(String token) {
        return authService.logout(token);
    }
    
    /**
     * 사용자 취미 정보 조회
     */
    public List<UserHobby> getUserHobbies(String email) {
        return hobbyService.getUserHobbies(email);
    }
    
    /**
     * 사용자 취미 정보 업데이트
     */
    public void updateUserHobbies(String email, List<HobbyRequest> hobbies) {
        hobbyService.registerUserHobbies(email, hobbies);
    }
    
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
        
        // 프로필 응답 구성
        return ProfileResponse.builder()
                .success(true)
                .message("프로필 조회 성공")
                .email(user.getEmail())
                .name(user.getName())
                .nickname(user.getNickname())
                .phoneNumber(user.getPhoneNumber())
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
        
        // 공개 프로필만 반환 (민감한 정보 제외)
        return ProfileResponse.builder()
                .success(true)
                .message("프로필 조회 성공")
                .nickname(user.getNickname())
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
                .phoneNumber(user.getPhoneNumber()) // 기존 전화번호 유지
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
    
    /**
     * 회원 탈퇴 처리 (소프트 삭제)
     */
    @Transactional
    public WithdrawalResponse withdrawUser(String email, WithdrawalRequest request) {
        // 사용자 존재 여부 확인
        User user = userMapper.findByEmail(email);
        if (user == null) {
            return WithdrawalResponse.builder()
                    .success(false)
                    .message("존재하지 않는 사용자입니다.")
                    .build();
        }
        
        // 소셜 로그인 사용자이거나, 이메일 로그인이면 비밀번호 확인
        if ("EMAIL".equals(user.getLoginMethod())) {
            // 비밀번호 확인
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                return WithdrawalResponse.builder()
                        .success(false)
                        .message("비밀번호를 입력해주세요.")
                        .build();
            }
            
            boolean isPasswordValid = passwordUtils.verifyPassword(
                    request.getPassword(),
                    user.getPasswordHash(),
                    null
            );
            
            if (!isPasswordValid) {
                return WithdrawalResponse.builder()
                        .success(false)
                        .message("비밀번호가 일치하지 않습니다.")
                        .build();
            }
        }
        
        // 현재 시간
        LocalDateTime now = LocalDateTime.now();
        
        // 개인정보 익명화 처리
        // 1. 무작위 코드 생성 (10자리)
        String randomCode = RandomUtils.generateRandomString(10);
        
        // 2. 닉네임 변경: "탈퇴회원_" + 무작위코드
        String newNickname = "탈퇴회원_" + randomCode;
        
        // 3. 휴대폰번호 마스킹
        String maskedPhoneNumber = RandomUtils.maskPhoneNumber(user.getPhoneNumber());
        
        // 4. 자기소개 변경
        String newBio = "탈퇴한 회원입니다.";
        
        // 사용자 정보 익명화 및 탈퇴 처리
        userMapper.anonymizeUserData(email, newNickname, maskedPhoneNumber, newBio, now);
        
        // 계정 정보 테이블의 상태도 업데이트
        userMapper.updateUserAccountInfoStatus(email, "Withdrawal");
        
        // 응답 생성
        return WithdrawalResponse.builder()
                .success(true)
                .message("회원 탈퇴가 완료되었습니다.")
                .withdrawalDate(now)
                .build();
    }
    
    /**
     * 토큰을 통한 회원 탈퇴 처리
     */
    @Transactional
    public WithdrawalResponse withdrawUserByToken(String token, WithdrawalRequest request) {
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return WithdrawalResponse.builder()
                    .success(false)
                    .message("유효하지 않은 인증 토큰입니다.")
                    .build();
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        
        WithdrawalResponse response = withdrawUser(email, request);
        
        // 성공적으로 탈퇴한 경우, 토큰을 블랙리스트에 추가
        if (response.isSuccess()) {
            try {
                // 토큰 만료 시간 가져오기
                java.util.Date expiration = jwtTokenProvider.getExpirationDate(tokenWithoutBearer);
                Long expiryMillis = expiration.getTime();
                
                // 블랙리스트에 추가
                jwtTokenBlacklistService.addToBlacklist(tokenWithoutBearer, expiryMillis);
                
                log.info("회원 탈퇴: 이메일={}, 토큰이 블랙리스트에 추가되었습니다.", email);
            } catch (Exception e) {
                log.error("회원 탈퇴 후 토큰 블랙리스팅 중 오류 발생: {}", e.getMessage());
            }
        }
        
        return response;
    }
}

