package com.example.demo.controller;

import com.example.demo.service.Market.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/core/test/v2")
public class TestController {
    
    private static final Logger log = LoggerFactory.getLogger(TestController.class);
    private final NotificationService notificationService;
    
    @Autowired
    public TestController(NotificationService notificationService) {
        this.notificationService = notificationService;
        log.info("TestController 초기화 완료, NotificationService 의존성 주입됨: {}", notificationService);
    }
    
    @GetMapping("/notify")
    public ResponseEntity<String> testNotification(
            @RequestParam String email, 
            @RequestParam String message) {
        log.info("알림 테스트 요청: 수신자={}, 메시지={}", email, message);
        
        try {
            // 알림 서비스를 통해 메시지 전송
            notificationService.sendNotification(email, message);
            log.info("알림 테스트 성공: {}", email);
            return ResponseEntity.ok("알림을 전송했습니다: " + email);
        } catch (Exception e) {
            log.error("알림 테스트 실패: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("알림 전송 실패: " + e.getMessage());
        }
    }
} 