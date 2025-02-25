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
public class User {
    private Integer userId;
    private String name;
    private String phoneNumber;
    private String email;
    private String nickname;
    private String bio;
    private LocalDateTime signupDate;
    private LocalDateTime lastUpdateDate;
    private LocalDateTime lastLoginTime;
}