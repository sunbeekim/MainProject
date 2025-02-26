package com.example.demo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Long id;
    private String username = "anonymous";  // 기본값 설정
    private Integer roleId = 1;            // 기본값 설정
    private String messageType;            // 'user' 또는 'assistant'
    private String content;
    private String sessionId;
    private LocalDateTime createdAt;
} 