package com.example.demo.controller;

import com.example.demo.dto.ChatRequestDTO;
import com.example.demo.dto.ChatResponseDTO;
import com.example.demo.service.CloudChatBotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assist/cloudchatbot")
public class CloudChatBotController {

    private final CloudChatBotService cloudChatBotService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        try {
            String message = request.getMessage();
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ChatResponseDTO("error", "메시지 내용이 비어있습니다.", "400"));
            }

            String response = cloudChatBotService.getResponse(message);
            
            ChatResponseDTO.Data data = new ChatResponseDTO.Data();
            data.setMessage(message);
            data.setResponse(response);
            
            ChatResponseDTO responseDTO = new ChatResponseDTO();
            responseDTO.setStatus("success");
            responseDTO.setData(data);
            responseDTO.setCode("200");
            
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ChatResponseDTO("error", "서버 처리 중 오류가 발생했습니다.", "500"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ChatResponseDTO> healthCheck() {
        ChatResponseDTO response = new ChatResponseDTO();
        response.setStatus("success");
        response.setCode("200");
        ChatResponseDTO.Data data = new ChatResponseDTO.Data();
        data.setResponse("Cloud ChatBot Service is running");
        response.setData(data);
        return ResponseEntity.ok(response);
    }
} 