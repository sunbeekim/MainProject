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
    private List<Integer> hobbyIds;
}

