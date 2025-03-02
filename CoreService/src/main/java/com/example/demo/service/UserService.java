package com.example.demo.service;


import com.example.demo.dto.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final AuthService authService;
    private final ProfileService profileService;  // 추가

    public SignupResponse registerUser(SignupRequest request) {
        return authService.registerUser(request);
    }

    public LoginResponse login(LoginRequest request) {
        return authService.login(request);
    }

    public LogoutResponse logout(String token) {
        return authService.logout(token);
    }
    
    // 새로 추가된 메서드
    public ProfileResponse getMyProfile(String token) {
        return profileService.getMyProfile(token);
    }
    
    public ProfileResponse getUserProfile(String email) {
        return profileService.getUserProfile(email);
    }
}

