package com.example.demo.controller;

import com.example.demo.service.LlamaService;
import com.example.demo.service.LlamaService.ChatMessage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assist/tinylamanaver")
@Tag(name = "Tiny Llama Chat API", description = "LlamaService 기반 AI 채팅 API")
public class LlamaController {

    private final LlamaService llamaService;
    private final Map<String, List<ChatMessage>> chatHistories = new HashMap<>();

    @Operation(summary = "AI 챗봇과 대화", description = "Tiny Llama 기반 챗봇과 대화하는 API")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적인 응답", 
                     content = @Content(schema = @Schema(implementation = ChatResponse.class))),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "사용자의 메시지와 세션 ID") 
            @RequestBody ChatRequest request) {
        
        System.out.println("=== LlamaController 채팅 요청 받음 ===");
        System.out.println("요청 데이터: " + request);

        String message = request.getMessage();
        String sessionId = request.getSessionId() != null ? request.getSessionId() : "default";

        // 세션별 히스토리 관리
        List<ChatMessage> history = chatHistories.computeIfAbsent(sessionId, k -> new ArrayList<>());

        String response = llamaService.chat(message, history);

        // 히스토리 업데이트
        ChatMessage userMessage = new ChatMessage("user", message);
        ChatMessage assistantMessage = new ChatMessage("assistant", response);
        history.add(userMessage);
        history.add(assistantMessage);

        // 히스토리 크기 제한 (최근 10개 메시지만 유지)
        if (history.size() > 10) {
            history = history.subList(history.size() - 10, history.size());
            chatHistories.put(sessionId, history);
        }

        System.out.println("히스토리 크기: " + history.size());
        System.out.println("LlamaService 응답: " + response);
        System.out.println("=== LlamaController 처리 완료 ===");

        return ResponseEntity.ok(Map.of("response", response));
    }

    // 요청 객체 (Swagger 문서화용)
    @Schema(description = "챗봇 요청 데이터")
    public static class ChatRequest {
        @Schema(description = "사용자 입력 메시지", example = "안녕!")
        private String message;
        
        @Schema(description = "대화 세션 ID (선택)", example = "12345")
        private String sessionId;

        public String getMessage() {
            return message;
        }

        public String getSessionId() {
            return sessionId;
        }
    }

    // 응답 객체 (Swagger 문서화용)
    @Schema(description = "챗봇 응답 데이터")
    public static class ChatResponse {
        @Schema(description = "챗봇 응답 메시지", example = "안녕하세요! 어떻게 도와드릴까요?")
        private String response;

        public ChatResponse(String response) {
            this.response = response;
        }

        public String getResponse() {
            return response;
        }
    }
}
