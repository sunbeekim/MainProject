package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequest {
    private String name;
    private String phoneNumber;
    private String email;
    private String nickname;
    private String password;
    private String hobby;
    private String bio;
    private String loginMethod;
    private String socialProvider;
}

