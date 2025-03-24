package com.example.demo.controller;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.model.Location;
import com.example.demo.service.LocationService;
import com.example.demo.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/core/location")
@RequiredArgsConstructor
@Slf4j
public class LocationController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final TokenUtils tokenUtils;
    private final LocationService locationService;

    /**
     * WebSocket을 통한 위치 업데이트 처리
     * /app/location/{chatroomId} 로 전송된 메시지를 처리합니다.
     */
    @MessageMapping("/location/{chatroomId}")
    public void handleLocationUpdate(
            @Payload Location location,
            SimpMessageHeaderAccessor headerAccessor,
            Principal principal) {
        
        if (principal == null) {
            log.error("위치 업데이트 처리 오류: 인증되지 않은 사용자");
            return;
        }

        String senderEmail = principal.getName();
        log.info("위치 업데이트 수신: chatroomId={}, senderEmail={}, location={}", 
                location.getChatroomId(), senderEmail, location);

        try {
            // 위치 정보 저장
            location.setEmail(senderEmail);
            location.setTimestamp(LocalDateTime.now());
            locationService.saveLocation(location);

            // 위치 정보를 채팅방의 모든 구독자에게 브로드캐스트
            messagingTemplate.convertAndSend(
                "/topic/location." + location.getChatroomId(),
                location
            );

            log.info("위치 정보 발행 완료: chatroomId={}, email={}", 
                    location.getChatroomId(), senderEmail);
        } catch (Exception e) {
            log.error("위치 정보 처리 중 오류 발생: {}", e.getMessage());
        }
    }

    /**
     * REST API를 통한 최근 위치 조회
     * JWT 토큰으로 인증된 사용자의 HTTP 요청을 처리합니다.
     */
    @GetMapping("/rooms/{chatroomId}/recent")
    public ResponseEntity<ApiResponse<?>> getRecentLocations(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer chatroomId) {
        
        String email = tokenUtils.getEmailFromAuthHeader(token);
        
        if (email == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        try {
            var locations = locationService.getRecentLocations(chatroomId);
            return ResponseEntity.ok(ApiResponse.success(locations));
        } catch (Exception e) {
            log.error("위치 정보 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("서버 오류가 발생했습니다.", "500"));
        }
    }

    /**
     * 특정 사용자의 마지막 위치 조회
     */
    @GetMapping("/rooms/{chatroomId}/users/{email}/last")
    public ResponseEntity<ApiResponse<?>> getLastLocation(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer chatroomId,
            @PathVariable String email) {
        
        String requestEmail = tokenUtils.getEmailFromAuthHeader(token);
        
        if (requestEmail == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        try {
            var location = locationService.getLastLocation(chatroomId, email);
            return ResponseEntity.ok(ApiResponse.success(location));
        } catch (Exception e) {
            log.error("위치 정보 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("서버 오류가 발생했습니다.", "500"));
        }
    }
}
