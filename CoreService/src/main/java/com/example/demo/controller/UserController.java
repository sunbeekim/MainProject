package com.example.demo.controller;

import com.example.demo.dto.ProfileResponse;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/core/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(@RequestHeader("Authorization") String token) {
        log.debug("Received request to get current user profile");
        ProfileResponse response = userService.getMyProfile(token);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{email}")
    public ResponseEntity<ProfileResponse> getUserProfile(@PathVariable String email) {
        log.debug("Received request to get profile for email: {}", email);
        ProfileResponse response = userService.getUserProfile(email);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
