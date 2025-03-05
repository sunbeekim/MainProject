package com.example.demo.controller;

import com.example.demo.dto.WithdrawalRequest;
import com.example.demo.dto.WithdrawalResponse;
import com.example.demo.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/core/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    
    /**
     * 회원 탈퇴
     */
    @PostMapping("/me/withdrawal")
    public ResponseEntity<WithdrawalResponse> withdraw(
            @RequestHeader("Authorization") String token,
            @RequestBody WithdrawalRequest request) {
        
        WithdrawalResponse response = userService.withdrawUserByToken(token, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
}
