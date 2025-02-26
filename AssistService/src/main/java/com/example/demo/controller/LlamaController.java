package com.example.demo.controller;

import com.example.demo.dto.ChatRequestDTO;
import com.example.demo.dto.ChatResponseDTO;
import com.example.demo.model.ChatMessage;
import com.example.demo.serviceimpl.LlamaServiceImpl;
import com.example.demo.dao.ChatMessageDAO;

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

    private final LlamaServiceImpl llamaServiceImpl;
    private final ChatMessageDAO chatMessageDAO;

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

            // DB에서 히스토리 가져오기
            List<ChatMessage> history = chatMessageDAO.getMessagesBySessionId(sessionId);

            // LlamaService 호출 시 히스토리 전달
            String response = llamaServiceImpl.chat(message, sessionId, history);

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
