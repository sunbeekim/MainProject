package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.SignupResponse;
import com.example.demo.mapper.UserLoginMapper;
import com.example.demo.model.UserLogin;
import com.example.demo.service.UserLoginService;
import com.example.demo.service.UserService;
import com.example.demo.util.CookieUtil;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Map;

// API 엔드포인트 처리

@RestController
@RequestMapping("/api/core/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserLoginService userLoginService;
    private final PasswordEncoder passwordEncoder;
    private final UserLoginMapper userLoginMapper;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        SignupResponse response = userService.registerUser(signupRequest);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        UserLogin userLogin = userLoginService.findByUsername(loginRequest.getUsername());
        if (userLogin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), userLogin.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        // ✅ userLoginId를 기반으로 토큰 생성
        String accessToken = JwtUtil.generateToken(userLogin); // 기존 메서드 활용
        String refreshToken = JwtUtil.generateToken(userLogin);

        return ResponseEntity.ok()
                .header("Set-Cookie", "refreshToken=" + refreshToken + "; HttpOnly; Secure; Path=/auth/refresh; SameSite=Strict")
                .body(Map.of("accessToken", accessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String refreshToken = CookieUtil.extractTokenFromCookie(request);

        if (refreshToken != null && JwtUtil.validateToken(refreshToken)) {
            Long userLoginId = JwtUtil.extractUserId(refreshToken);

            // 서버 측에서 refreshToken 무효화 (예: Redis 또는 DB에서 삭제)
            userLoginService.invalidateRefreshToken(userLoginId);
        }

        // 클라이언트 측에서 쿠키 삭제 (Set-Cookie 활용)
        return ResponseEntity.ok()
                .header("Set-Cookie", "refreshToken=; HttpOnly; Secure; Path=/api/core/auth/refresh; Max-Age=0; SameSite=Strict")
                .body("로그아웃 성공");
    }








    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = CookieUtil.extractTokenFromCookie(request);

        if (refreshToken != null && JwtUtil.validateToken(refreshToken)) {
            Long userLoginId = JwtUtil.extractUserId(refreshToken); // userLoginId 가져옴

            // userLoginId로 UserLogin 찾기
            UserLogin userLogin = userLoginService.findByUserLoginId(userLoginId);

            if (userLogin == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // 새 액세스 토큰 생성
            String newAccessToken = JwtUtil.generateToken(userLogin);
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
    }
}