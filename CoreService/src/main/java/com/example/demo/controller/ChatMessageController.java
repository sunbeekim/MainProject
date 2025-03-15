package com.example.demo.controller;

import com.example.demo.dto.chat.ChatMessageRequest;
import com.example.demo.dto.chat.ChatMessagesResponse;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.model.chat.ChatMessage;
import com.example.demo.service.ChatMessageService;
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

@RestController
@RequestMapping("/api/core/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final TokenUtils tokenUtils;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * WebSocket을 통한 메시지 전송
     * 인증된 사용자의 WebSocket 세션을 통해 메시지를 처리합니다.
     */
    @MessageMapping("/chat.message")
    public void processMessage(
            @Payload ChatMessageRequest messageRequest,
            SimpMessageHeaderAccessor headerAccessor,
            Principal principal) {
        
        // Principal을 통해 인증된 사용자 정보 가져오기
        if (principal == null) {
            log.error("WebSocket 메시지 처리 오류: 인증되지 않은 사용자");
            return;
        }
        
        // 사용자 이메일 추출 (Principal은 인증 단계에서 사용자 이메일로 설정됨)
        String senderEmail = principal.getName();
        log.info("WebSocket 메시지 수신: chatroomId={}, senderEmail={}", 
                messageRequest.getChatroomId(), senderEmail);
        
        try {
            // 메시지 저장 및 발행 (Redis)
            ChatMessage chatMessage = chatMessageService.sendMessage(senderEmail, messageRequest);
            log.info("메시지 저장 완료: messageId={}", chatMessage.getMessageId());
        } catch (Exception e) {
            log.error("메시지 처리 중 오류 발생: {}", e.getMessage());
            // 오류 메시지를 클라이언트에게 전달할 수도 있음
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/errors",
                "메시지 전송 중 오류가 발생했습니다: " + e.getMessage()
            );
        }
    }

    /**
     * REST API를 통한 메시지 전송
     * JWT 토큰으로 인증된 사용자의 HTTP 요청을 처리합니다.
     */
    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<?>> sendMessage(
            @RequestHeader("Authorization") String token,
            @RequestBody ChatMessageRequest request) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        
        try {
            ChatMessage message = chatMessageService.sendMessage(email, request);
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (IllegalArgumentException e) {
            log.warn("메시지 전송 검증 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "400"));
        } catch (Exception e) {
            log.error("메시지 전송 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(ApiResponse.error("메시지 전송 중 오류가 발생했습니다.", "500"));
        }
    }

    /**
     * 채팅방 메시지 목록 조회
     */
    @GetMapping("/rooms/{chatroomId}/messages")
    public ResponseEntity<ApiResponse<?>> getChatMessages(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer chatroomId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        ChatMessagesResponse response = chatMessageService.getChatMessages(chatroomId, email, page, size);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage(), "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 메시지 읽음 상태 업데이트
     */
    @PutMapping("/rooms/{chatroomId}/read")
    public ResponseEntity<ApiResponse<?>> markMessagesAsRead(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer chatroomId) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        
        try {
            boolean success = chatMessageService.markMessagesAsRead(chatroomId, email);
            
            if (success) {
                return ResponseEntity.ok(ApiResponse.success("메시지가 읽음 상태로 업데이트 되었습니다."));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("메시지 상태 업데이트 실패", "400"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "400"));
        } catch (Exception e) {
            log.error("메시지 읽음 상태 업데이트 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(ApiResponse.error("서버 오류가 발생했습니다.", "500"));
        }
    }
}
