package com.example.demo.dto;
//로그인을 응답할 DTO 작성 (입,출력 데이터 전달)


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

    private Long userLoginId; // ID
    private String message; // 로그인 성공 여부 메세지
    private boolean isLocked; // 로그인 잠금 여부
    private String accessToken; // JWT 토큰

}
