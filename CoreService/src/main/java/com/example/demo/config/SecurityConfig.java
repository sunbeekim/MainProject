package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.security.JwtAuthenticationEntryPoint;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenBlacklistService jwtTokenBlacklistService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final OAuth2Config oauth2Config;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http

                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리 안함
                .exceptionHandling(exceptionHandling -> 
                    exceptionHandling.authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                // 정적 리소스에 대한 접근 허용
                                "/profile-images/**",
                                "/chat-images/**",
                                "/uploads/**",
                                "/board-files/**", // 게시판 이미지 접근 허용
                                "/api/core/auth/signup",
                                "/api/core/auth/login",
                                "/api/core/auth/logout",
                                "/api/core/auth/me/password/notoken",
                                "/api/core/auth/me/password",
                                "/api/core/hobbies",
                                "/api.core/hobbies/simple", 
                                "/api/core/hobbies/categories",
                                "/api/core/hobbies/*/categories",
                                "/api/core/hobbies/categories/*",
                                "/api/core/profiles/user/*", 
                                "/api/core/market/*",
                                "/ws/**",
                                "/api/core/market/products/requests/approved",
                                "/api/core/market/products/all",
                                "/api/core/market/products/all/filter",
                                "/api/core/market/products/images/**",
                                "/api/core/market/products/{id}",
                                "/topic/**",
                                "/app/**",
                                "/api/core/chat/**",
                                "/api/core/chat/rooms/**",
                                "/api/core/chat/rooms/{chatroomId}/read",
                                "/api/core/chat/rooms/{chatroomId}/approve",
                                "/api/core/chat/messages/**",
                                "/api/core/boards/{boardId}/members" // 게시판 멤버 조회 API 추가
                        )
                        .permitAll()
                        .requestMatchers("/api/core/profiles/admin/**").hasRole("ADMIN") // 관리자 전용 API
                        .requestMatchers(
                                "/api/core/market/products/registers",
                                "/api/core/market/products/requests",
                                "/api/core/market/products/requests/approve",
                                "/api/core/market/products/users",
                                "/api/core/market/products/users/registers/buy",
                                "/api/core/market/products/users/registers/sell",
                                "/api/core/market/products/users/requests/buy",
                                "/api/core/market/products/users/requests/sell")
                        .authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtTokenProvider, jwtTokenBlacklistService),
                        UsernamePasswordAuthenticationFilter.class
                )
                .logout(logout -> logout.disable());
        
        // OAuth2 설정을 OAuth2Config에 위임
        oauth2Config.configure(http);
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // 보안 강도 12 권장
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // LocalDateTime 등의 Java 8 시간 타입 지원
        return objectMapper;
    }
}