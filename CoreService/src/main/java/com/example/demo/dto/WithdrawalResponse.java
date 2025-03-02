package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalResponse {
    private boolean success;
    private String message;
    private LocalDateTime withdrawalDate;
    private String email; // 마스킹 처리된 이메일 반환
}
