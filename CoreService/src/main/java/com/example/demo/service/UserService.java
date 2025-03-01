package com.example.demo.service;

import com.example.demo.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthService authService;


    public SignupResponse registerUser(SignupRequest request) {
        return authService.registerUser(request);
    }

    public LoginResponse login(LoginRequest request) {
        return authService.login(request);
    }

    public LogoutResponse logout(String token) {
        return authService.logout(token);
    }


}