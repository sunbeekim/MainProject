package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    // 수정 가능한 필드들
    private String name;
    private String nickname;
    private String bio;
    private List<HobbyRequest> hobbies;
}
