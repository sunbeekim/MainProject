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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final TokenUtils tokenUtils;

    /**
     * 웹소켓을 통한 채팅 메시지 전송
     * /app/chat.message로 메시지를 전송하면 이 메소드가 호출됨
     */
    @MessageMapping("/chat.message")
    public void sendMessage(@Payload ChatMessageRequest request, SimpMessageHeaderAccessor headerAccessor) {
        // 사용자 이메일 추출 (StompHandler에서 설정된 Principal)
        String senderEmail = headerAccessor.getUser().getName();
        log.info("Received message from {}: {}", senderEmail, request.getContent());
        
        try {
            // 메시지 저장 및 발행
            chatMessageService.sendMessage(senderEmail, request);
        } catch (Exception e) {
            log.error("Error processing message: {}", e.getMessage());
        }
    }
    
    /**
     * 메시지 목록 조회 (REST API)
     */
    @GetMapping("/api/core/chat/rooms/{chatroomId}/messages")
    public ResponseEntity<ApiResponse<?>> getChatMessages(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer chatroomId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        ChatMessagesResponse response = chatMessageService.getChatMessages(chatroomId, page, size);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(response, "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * REST API를 통한 채팅 메시지 전송 (WebSocket을 사용할 수 없는 경우 대체 API)
     */
    @PostMapping("/api/core/chat/messages")
    public ResponseEntity<ApiResponse<?>> sendMessageViaRest(
            @RequestHeader("Authorization") String token,
            @RequestBody ChatMessageRequest request) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        String senderEmail = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        
        try {
            // 메시지 저장 및 발행
            ChatMessage message = chatMessageService.sendMessage(senderEmail, request);
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage(), "400"));
        } catch (Exception e) {
            log.error("메시지 전송 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body(ApiResponse.error("메시지 전송 중 오류가 발생했습니다.", "500"));
        }
    }
}
