package com.example.demo.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

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
            
            // OPTIONS 요청은 바로 통과
            if (request.getMethod() == HttpMethod.OPTIONS) {
                return chain.filter(exchange);  // 단순히 체인 계속 진행
            }
            
            String path = request.getPath().value();
            
            // PUBLIC_PATHS 체크
            if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
                return chain.filter(exchange);
            }

            // JWT 토큰 검증 로직
            String token = request.getHeaders().getFirst("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return Mono.fromRunnable(() -> {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                });
            }

            try {
                // JWT 토큰 검증
                Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey.getBytes())
                    .build()
                    .parseClaimsJws(token.substring(7))
                    .getBody();

                // 사용자 정보를 헤더에 추가
                ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Id", claims.getSubject())
                    .header("X-User-Role", claims.get("role", String.class))
                    .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) {
                return Mono.fromRunnable(() -> {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                });
            }
        };
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(publicPath -> {
            if (publicPath.endsWith("/**")) {
                // /** 패턴에 대한 처리
                String prefix = publicPath.substring(0, publicPath.length() - 2);
                return path.startsWith(prefix);
            }
            return path.equals(publicPath);
        });
    }
} 