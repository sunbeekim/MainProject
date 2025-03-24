package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private Integer chatroomId;
    private String email;
    private Double lat;
    private Double lng;
    private String address;
    private LocalDateTime timestamp;
} 