package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.model.UserAccountInfo;
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
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordUtils passwordUtils;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenBlacklistService jwtTokenBlacklistService;

    private static final int MAX_FAILED_ATTEMPTS = 5;

    /**
     * 회원가입
     */
    @Transactional
    public SignupResponse registerUser(SignupRequest request) {
        // 이메일 중복 체크
        if (userMapper.findByEmail(request.getEmail()) != null) {
            return SignupResponse.builder()
                    .success(false)
                    .message("이미 존재하는 이메일입니다.")
                    .build();
        }

        // 닉네임 중복 체크
        if (userMapper.findByNickname(request.getNickname()) != null) {
            return SignupResponse.builder()
                    .success(false)
                    .message("이미 존재하는 닉네임입니다.")
                    .build();
        }

        // 전화번호 중복 체크 (선택 사항)
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            if (userMapper.findByPhoneNumber(request.getPhoneNumber()) != null) {
                return SignupResponse.builder()
                        .success(false)
                        .message("이미 등록된 전화번호입니다.")
                        .build();
            }
        }

        // 비밀번호 해싱
        String hashedPassword = passwordUtils.hashPassword(request.getPassword(), null).get("hashedPassword");

        // 현재 시간 설정
        LocalDateTime now = LocalDateTime.now();

        // 사용자 정보 생성 - hobby 필드 제거됨
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .nickname(request.getNickname())
                // hobby 필드 제거됨
                .bio(request.getBio())
                .loginMethod(request.getLoginMethod() != null ? request.getLoginMethod() : "EMAIL")
                .socialProvider(request.getSocialProvider() != null ? request.getSocialProvider() : "NONE")
                .accountStatus("Active")
                .authority("USER")
                .signupDate(now)
                .lastUpdateDate(now)
                .lastLoginTime(null)
                .loginFailedAttempts(0)
                .loginIsLocked(false)
                .build();

        // 사용자 등록
        userMapper.insertUser(user);

        // 계정 정보 추가
        UserAccountInfo accountInfo = UserAccountInfo.builder()
                .email(user.getEmail())
                .accountStatus("Active")
                .authority("1")  // 일반 사용자
                .authorityName("Regular User")
                .build();

        userMapper.insertUserAccountInfo(accountInfo);

        // 취미 정보 추가 (있는 경우)
        if (request.getHobbyIds() != null && !request.getHobbyIds().isEmpty()) {
            for (Integer hobbyId : request.getHobbyIds()) {
                userMapper.insertUserHobby(user.getEmail(), hobbyId);
            }
        }

        return SignupResponse.builder()
                .success(true)
                .email(user.getEmail())
                .message("회원가입이 완료되었습니다.")
                .build();
    }

    /**
     * 로그인
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // 사용자 정보 조회
        User user = userMapper.findByEmail(request.getEmail());
        if (user == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("잘못된 이메일 또는 비밀번호입니다.")
                    .build();
        }

        // 계정 상태 확인
        if (!"Active".equals(user.getAccountStatus())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("현재 계정이 활성 상태가 아닙니다.")
                    .build();
        }

        // 계정 잠금 확인
        if (Boolean.TRUE.equals(user.getLoginIsLocked())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("반복된 로그인 실패로 계정이 잠금되었습니다.")
                    .build();
        }

        // 비밀번호 검증
        boolean isPasswordValid = passwordUtils.verifyPassword(
                request.getPassword(),
                user.getPasswordHash(),
                null
        );

        if (!isPasswordValid) {
            // 로그인 실패 횟수 증가
            int failedAttempts = user.getLoginFailedAttempts() + 1;
            userMapper.updateFailedLoginAttempts(user.getEmail(), failedAttempts);

            // 최대 실패 횟수 초과 시 계정 잠금
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                userMapper.updateLoginLockStatus(user.getEmail(), true);
                return LoginResponse.builder()
                        .success(false)
                        .message("로그인 실패 횟수가 초과되어 계정이 잠금되었습니다.")
                        .build();
            }

            return LoginResponse.builder()
                    .success(false)
                    .message("잘못된 이메일 또는 비밀번호입니다.")
                    .build();
        }

        // 로그인 성공 → 실패 카운트 초기화 및 마지막 로그인 시간 업데이트
        userMapper.updateFailedLoginAttempts(user.getEmail(), 0);
        userMapper.updateLoginTime(user.getEmail());

        // 권한 설정
        String role = "ROLE_" + user.getAuthority().toUpperCase();

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(
                user.getId().intValue(),
                user.getEmail(),
                Collections.singletonList(role)
        );

        return LoginResponse.builder()
                .success(true)
                .token(token)
                .email(user.getEmail())
                .nickname(user.getNickname())
                .message("로그인 성공")
                .build();
    }

    /**
     * 로그아웃
     */
    @Transactional
    public LogoutResponse logout(String token) {
        if (token == null || token.isEmpty()) {
            return LogoutResponse.builder()
                    .success(false)
                    .message("토큰이 제공되지 않았습니다.")
                    .build();
        }

        try {
            // Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // 토큰 검증
            if (!jwtTokenProvider.validateToken(token) || jwtTokenBlacklistService.isBlacklisted(token)) {
                return LogoutResponse.builder()
                        .success(false)
                        .message("유효하지 않은 토큰입니다.")
                        .build();
            }

            // 토큰 만료 시간 가져오기
            Date expiration = jwtTokenProvider.getExpirationDate(token);
            Long expiryMillis = expiration.getTime();

            // 블랙리스트 추가
            jwtTokenBlacklistService.addToBlacklist(token, expiryMillis);

            LocalDateTime expiryDateTime = LocalDateTime.ofInstant(
                    expiration.toInstant(), ZoneId.systemDefault());

            return LogoutResponse.builder()
                    .success(true)
                    .message("성공적으로 로그아웃되었습니다.")
                    .invalidatedUntil(expiryDateTime)
                    .build();
        } catch (Exception e) {
            return LogoutResponse.builder()
                    .success(false)
                    .message("로그아웃 중 오류 발생: " + e.getMessage())
                    .build();
        }
    }
}
