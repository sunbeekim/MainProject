package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequest {
    private String name;
    private String phoneNumber;
    private String email;
    private String nickname;
    private String password;
    private String bio;
    private String loginMethod;
    private String socialProvider;
    
    // 취미는 이제 문자열이 아닌 객체 리스트로 관리
    private List<HobbyRequest> hobbies;
}

