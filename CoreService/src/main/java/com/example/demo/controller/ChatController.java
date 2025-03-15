package com.example.demo.controller;

import com.example.demo.dto.chat.ChatRoomRequest;
import com.example.demo.dto.chat.ChatRoomResponse;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.service.ChatService;
import com.example.demo.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/core/chat/rooms")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final TokenUtils tokenUtils;

    /**
     * 채팅방 생성/조회
     */
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createChatRoom(
            @RequestHeader("Authorization") String token,
            @RequestBody ChatRoomRequest request) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        ChatRoomResponse response = chatService.createOrGetChatRoom(email, request);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage(), "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 사용자의 채팅방 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getChatRoomsByUser(
            @RequestHeader("Authorization") String token) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        ChatRoomResponse response = chatService.getChatRoomsByUser(email);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 특정 채팅방 상세 정보 조회
     */
    @GetMapping("/{chatroomId}")
    public ResponseEntity<ApiResponse<?>> getChatRoomDetail(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer chatroomId) {
        
        String tokenWithoutBearer = tokenUtils.extractTokenWithoutBearer(token);
        
        if (!tokenUtils.isTokenValid(tokenWithoutBearer)) {
            return ResponseEntity.status(401).body(ApiResponse.error("인증되지 않은 요청입니다.", "401"));
        }
        
        String email = tokenUtils.getEmailFromToken(tokenWithoutBearer);
        ChatRoomResponse response = chatService.getChatRoomDetail(email, chatroomId);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage(), "400"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
