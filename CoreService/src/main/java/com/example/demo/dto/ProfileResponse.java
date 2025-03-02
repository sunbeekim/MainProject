package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 사용자 프로필 정보 응답 DTO
 * 본인 조회 시 모든 정보 포함, 다른 사용자 조회 시 제한된 정보만 포함
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    // 응답 상태
    private boolean success;
    private String message;
    
    // 기본 사용자 정보
    private Long userId;
    private String email;
    private String name;
    private String nickname;
    private String phoneNumber;
    private String bio;
    
    // 취미 정보 (리스트)
    private List<String> hobbies;
    private List<String> hobbyCategories;
    
    // 위치 정보
    private String locationName;
    private Double latitude;
    private Double longitude;
    
    // 계정 정보
    private LocalDateTime signupDate;
    private LocalDateTime lastLoginTime;
    private String accountStatus;
}
