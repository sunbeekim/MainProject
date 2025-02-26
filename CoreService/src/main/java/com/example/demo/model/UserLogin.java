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
public class UserLogin {
    private Long userLoginId;
    private String passwordHash;
    private String passwordSalt;
    private String loginMethod;
    private String socialProvider;
    private LocalDateTime userLastLoginAt;
    private Integer loginFailedAttempts;
    private Boolean loginIsLocked;
    private Integer userId;
}
