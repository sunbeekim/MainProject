package com.example.demo.controller;

import com.example.demo.dto.ChatRequestDTO;
import com.example.demo.dto.ChatResponseDTO;
import com.example.demo.service.LlamaService;
import com.example.demo.service.CloudChatBotService;
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
    private final CloudChatBotService cloudChatBotService;
    private final Map<String, List<ChatMessage>> chatHistories = new HashMap<>();

    @Operation(summary = "AI 챗봇과 대화")
    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ChatResponseDTO("error", "메시지 내용이 비어있습니다.", "400"));
            }

            String message = request.getMessage();
            String sessionId = request.getSessionId() != null ? request.getSessionId() : "default";

            // CloudChatBot 먼저 시도
            try {
                String cloudResponse = cloudChatBotService.getResponse(message);
                if (cloudResponse != null && !cloudResponse.trim().isEmpty()) {
                    // CloudChatBot에서 응답이 왔으면 바로 반환
                    ChatResponseDTO.Data data = new ChatResponseDTO.Data();
                    data.setMessage(message);
                    data.setResponse(cloudResponse);
                    
                    ChatResponseDTO responseDTO = new ChatResponseDTO();
                    responseDTO.setStatus("success");
                    responseDTO.setData(data);
                    responseDTO.setCode("200");

                    // 채팅 히스토리 업데이트
                    List<ChatMessage> history = chatHistories.computeIfAbsent(sessionId, k -> new ArrayList<>());
                    ChatMessage userMessage = new ChatMessage("user", message);
                    ChatMessage assistantMessage = new ChatMessage("assistant", cloudResponse);
                    history.add(userMessage);
                    history.add(assistantMessage);

                    if (history.size() > 10) {
                        history = history.subList(history.size() - 10, history.size());
                        chatHistories.put(sessionId, history);
                    }

                    return ResponseEntity.ok(responseDTO);
                }
            } catch (Exception e) {
                // CloudChatBot 호출 실패 시 로그만 남기고 LlamaService로 진행
                System.err.println("CloudChatBot 서비스 호출 실패: " + e.getMessage());
            }

            // CloudChatBot에서 응답이 없거나 실패한 경우 LlamaService 사용
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

            ChatResponseDTO.Data data = new ChatResponseDTO.Data();
            data.setMessage(message);
            data.setResponse(response);
            
            ChatResponseDTO responseDTO = new ChatResponseDTO();
            responseDTO.setStatus("success");
            responseDTO.setData(data);
            responseDTO.setCode("200");

            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ChatResponseDTO("error", "서버 처리 중 오류가 발생했습니다.", "500"));
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ChatResponseDTO> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ChatResponseDTO("error", "예상치 못한 오류가 발생했습니다.", "500"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ChatResponseDTO> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ChatResponseDTO("error", "잘못된 요청 형식입니다.", "400"));
    }
}
