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

    @Operation(summary = "AI 챗봇과 대화", description = "Tiny Llama 기반 챗봇과 대화하는 API")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적인 응답", 
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(example = "{" +
                        "\"status\": \"success\"," +
                        "\"data\": {" +
                            "\"response\": \"안녕하세요! 어떻게 도와드릴까요?\"" +
                        "}" +
                    "}"))),
        @ApiResponse(responseCode = "400", description = "잘못된 요청",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(example = "{" +
                        "\"status\": \"error\"," +
                        "\"message\": \"메시지 내용이 비어있습니다.\"," +
                        "\"code\": \"400\"" +
                    "}"))),
        @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(example = "{" +
                        "\"status\": \"error\"," +
                        "\"message\": \"서버 처리 중 오류가 발생했습니다.\"," +
                        "\"code\": \"500\"" +
                    "}")))
    })
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

            return ResponseEntity.ok(new ChatResponse(response));

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

    @Schema(description = "챗봇 응답 데이터")
    public static class ChatResponse {
        @Schema(description = "응답 상태", example = "success")
        private String status;
        
        @Schema(description = "응답 데이터")
        private Data data;
        
        @Schema(description = "에러 메시지")
        private String message;
        
        @Schema(description = "에러 코드")
        private String code;
        
        public static class Data {
            @Schema(description = "챗봇 응답 메시지", example = "안녕하세요! 어떻게 도와드릴까요?")
            private String response;
            
            public Data(String response) {
                this.response = response;
            }
            
            public String getResponse() {
                return response;
            }
        }
        
        public ChatResponse(String response) {
            this.status = "success";
            this.data = new Data(response);
            this.message = null;
            this.code = null;
        }
        
        public ChatResponse(String errorCode, String errorMessage) {
            this.status = "error";
            this.data = null;
            this.message = errorMessage;
            this.code = errorCode;
        }
        
        public String getStatus() {
            return status;
        }
        
        public Data getData() {
            return data;
        }
        
        public String getMessage() {
            return message;
        }
        
        public String getCode() {
            return code;
        }
    }
}
