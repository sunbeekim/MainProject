package com.example.demo.controller;

import com.example.demo.service.Market.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/core/test")
@RequiredArgsConstructor
@Slf4j
public class NotificationTestController {

    private final NotificationService notificationService;

    /**
     * 알림 테스트용 엔드포인트 (GET)
     */
    @GetMapping("/notify")
    public ResponseEntity<String> testNotification(
            @RequestParam String email, 
            @RequestParam String message) {
        
        log.info("GET 알림 테스트 요청: email={}, message={}", email, message);
        
        try {
            notificationService.sendNotification(email, message);
            return ResponseEntity.ok("알림 전송 완료!");
        } catch (Exception e) {
            log.error("알림 테스트 중 오류 발생", e);
            return ResponseEntity.internalServerError().body("알림 전송 실패: " + e.getMessage());
        }
    }
    
    /**
     * 알림 테스트용 엔드포인트 (POST)
     */
    @PostMapping("/notify")
    public ResponseEntity<String> testNotificationPost(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String message = payload.get("message");
        
        log.info("POST 알림 테스트 요청: email={}, message={}", email, message);
        
        if (email == null || message == null) {
            return ResponseEntity.badRequest().body("email과 message는 필수 항목입니다.");
        }
        
        try {
            notificationService.sendNotification(email, message);
            return ResponseEntity.ok("알림 전송 완료!");
        } catch (Exception e) {
            log.error("알림 테스트 중 오류 발생", e);
            return ResponseEntity.internalServerError().body("알림 전송 실패: " + e.getMessage());
        }
    }
} 