package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLocation {
    private String email;  // 이메일을 기본 식별자로 사용
    private String locationName;
    private Double latitude;
    private Double longitude;
    private java.time.LocalDateTime recordedAt;
}
