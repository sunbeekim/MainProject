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
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;

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

    @Operation(summary = "AI 챗봇과 대화")
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ChatResponse("400", "메시지 내용이 비어있습니다."));
            }

            String message = request.getMessage();
            String sessionId = request.getSessionId() != null ? request.getSessionId() : "default";

            List<ChatMessage> history = chatHistories.computeIfAbsent(sessionId, k -> new ArrayList<>());

            String response = llamaService.chat(message, history);

            ChatMessage userMessage = new ChatMessage("user", message);
            ChatMessage assistantMessage = new ChatMessage("assistant", response);
            history.add(userMessage);
            history.add(assistantMessage);

            if (history.size() > 10) {
                history = history.subList(history.size() - 10, history.size());
                chatHistories.put(sessionId, history);
            }

            return ResponseEntity.ok(new ChatResponse(message, response));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ChatResponse("500", "서버 처리 중 오류가 발생했습니다."));
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ChatResponse> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ChatResponse("500", "예상치 못한 오류가 발생했습니다."));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ChatResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ChatResponse("400", "잘못된 요청 형식입니다."));
    }

    public static class ChatRequest {
        private String message;
        private String sessionId;

        public String getMessage() {
            return message;
        }

        public String getSessionId() {
            return sessionId;
        }
    }

    public static class ChatResponse {
        private String status;
        private Data data;
        private String code;
        
        public static class Data {
            private String message;
            private String response;
            
            public Data(String message, String response) {
                this.message = message;
                this.response = response;
            }
            
            public String getMessage() {
                return message;
            }
            
            public String getResponse() {
                return response;
            }
        }

        public ChatResponse(String userMessage, String botResponse) {
            this.status = "success";
            this.data = new Data(userMessage, botResponse);
            this.code = "200";
        }
        
        public ChatResponse(String errorMessage, Integer errorCode) {
            this.status = "error";
            this.data = new Data(null, errorMessage);
            this.code = errorCode.toString();
        }
        
        public String getStatus() {
            return status;
        }
        
        public Data getData() {
            return data;
        }
        
        public String getCode() {
            return code;
        }
    }
}
