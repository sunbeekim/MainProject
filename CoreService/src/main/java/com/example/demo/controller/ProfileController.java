package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/core/profiles")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {
    
    private final UserService userService;
    
    /**
     * 자신의 프로필 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(@RequestHeader("Authorization") String token) {
        ProfileResponse profile = userService.getUserProfileByToken(token);
        
        if (!profile.isSuccess()) {
            return ResponseEntity.badRequest().body(profile);
        }
        
        return ResponseEntity.ok(profile);
    }
    
    /**
     * 닉네임으로 다른 사용자의 프로필 조회 (공개 정보만)
     */
    @GetMapping("/user/{nickname}")
    public ResponseEntity<ProfileResponse> getUserProfile(@PathVariable String nickname) {
        ProfileResponse profile = userService.getPublicProfile(nickname);
        
        if (!profile.isSuccess()) {
            return ResponseEntity.badRequest().body(profile);
        }
        
        return ResponseEntity.ok(profile);
    }
    
    /**
     * 이메일로 사용자 프로필 조회 (관리자 기능)
     */
    @GetMapping("/admin/user/{email}")
    public ResponseEntity<ProfileResponse> getAdminUserProfile(
            @RequestHeader("Authorization") String token,
            @PathVariable String email) {
        
        // 주의: 실제 구현에서는 여기에 관리자 권한 검증 필요
        ProfileResponse profile = userService.getUserProfile(email);
        
        if (!profile.isSuccess()) {
            return ResponseEntity.badRequest().body(profile);
        }
        
        return ResponseEntity.ok(profile);
    }
    
    /**
     * 자신의 프로필 수정
     */
    @PutMapping("/me")
    public ResponseEntity<ProfileUpdateResponse> updateMyProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody ProfileUpdateRequest request) {
        
        ProfileUpdateResponse response = userService.updateProfileByToken(token, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 비밀번호 변경
     */
    @PutMapping("/me/password")
    public ResponseEntity<PasswordChangeResponse> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody PasswordChangeRequest request) {
        
        PasswordChangeResponse response = userService.changePasswordByToken(token, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
}
