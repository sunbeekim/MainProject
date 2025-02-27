package com.example.demo.dto;
// 로그인을 요청할 DTO 작성 (입,출력 데이터 전달)

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    private String username; // 이메일 및 소셜 아이디
    private String password; // 비밀번호 및 소셜 로그인 토큰
    private enum loginMethod {// 로그인 방식 : EMAIL or SOCIAL
        EMAIL, SOCIAL
    }

}
