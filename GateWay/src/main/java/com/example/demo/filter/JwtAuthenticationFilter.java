package com.example.demo.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

import io.jsonwebtoken.Jwts;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final List<String> PUBLIC_PATHS = Arrays.asList(
        "/api/core/auth/login",     // 로그인
        "/api/core/auth/register",  // 회원가입
        "/api/core/auth/refresh",   // 토큰 재발급 (선택적)
        "/api/core/auth/verify-email", // 이메일 인증 (선택적)
        "/api/core/health",          // 헬스체크
        "/api/assist/tinylamanaver/chat",  // 테스트 채팅
        "/api/core/test/**"         // 테스트 엔드포인트
    );

    public static class Config {
        // 필터 설정을 위한 설정 클래스
    }

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().value();

            if (isPublicPath(path)) {
                return chain.filter(exchange);
            }

            String token = extractToken(request);
            if (token == null || !validateToken(token)) {
                throw new RuntimeException("Invalid or missing token");
            }

            return chain.filter(exchange);
        };
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(p -> 
            p.endsWith("**") ? path.startsWith(p.substring(0, p.length() - 2)) : path.equals(p)
        );
    }

    private String extractToken(ServerHttpRequest request) {
        List<String> headers = request.getHeaders().get("Authorization");
        if (headers == null || headers.isEmpty()) {
            return null;
        }
        String header = headers.get(0);
        if (header == null || !header.startsWith("Bearer ")) {
            return null;
        }
        return header.substring(7);
    }

    private boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}