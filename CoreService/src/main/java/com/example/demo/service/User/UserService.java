package com.example.demo.service.User;


import com.example.demo.dto.User.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
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

