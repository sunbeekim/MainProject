package com.example.demo.dto;

import com.example.demo.model.UserHobby;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private boolean success;
    private String message;
    
    // 기본 프로필 정보
    private String email;
    private String name;
    private String nickname;
    private String phoneNumber;
    private String profileImageUrl;  // 프로필 이미지 URL 추가
    private String bio;
    private String loginMethod;
    private String accountStatus;
    private LocalDateTime signupDate;
    private LocalDateTime lastLoginTime;
    
    // 사용자 취미 정보
    private List<HobbyInfo> hobbies;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HobbyInfo {
        private Long hobbyId;
        private String hobbyName;
        private Long categoryId;
        private String categoryName;
        
        // UserHobby 모델 객체로부터 HobbyInfo 생성
        public static HobbyInfo fromUserHobby(UserHobby userHobby) {
            return HobbyInfo.builder()
                    .hobbyId(userHobby.getHobbyId())
                    .hobbyName(userHobby.getHobbyName())
                    .categoryId(userHobby.getCategoryId())
                    .categoryName(userHobby.getCategoryName())
                    .build();
        }
    }
}
