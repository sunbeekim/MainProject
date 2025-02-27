package com.example.demo.model;
// 모델 클래스 : DB 테이블과 매핑
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLogin {
    private Long userLoginId;
    // private String userName; // 이메일 및 소셜 아이디
    private String passwordHash;
    // private String passwordSalt; BCrypt 적용으로 salt 생략
    private String loginMethod;
    private String socialProvider;
    private LocalDateTime userLastLoginAt;
    private Integer loginFailedAttempts;
    private Boolean loginIsLocked;
    private Integer userId;
}
