package com.example.demo.dto;

import lombok.Data;

@Data
public class ChatRequestDTO {
    private String message;
    private String sessionId;
}
