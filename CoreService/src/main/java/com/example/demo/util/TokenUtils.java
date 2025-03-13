package com.example.demo.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;

@Component
@RequiredArgsConstructor
public class TokenUtils {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenBlacklistService blacklistService;

    /**
     * 토큰에서 Bearer 접두사를 제거합니다
     */
    public String extractTokenWithoutBearer(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }

    /**
     * 토큰이 유효하고 블랙리스트에 없는지 확인합니다
     */
    public boolean isTokenValid(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        return jwtTokenProvider.validateToken(token) && !blacklistService.isBlacklisted(token);
    }

    /**
     * 토큰에서 사용자 ID를 추출합니다
     */
    public Integer getUserIdFromToken(String token) {
        if (!isTokenValid(token)) {
            return null;
        }

        return jwtTokenProvider.getUserId(token);
    }
    
    /**
     * 토큰에서 사용자 이메일을 추출합니다
     */
    public String getEmailFromToken(String token) {
        if (!isTokenValid(token)) {
            return null;
        }
        
        return jwtTokenProvider.getUsername(token);
    }
}