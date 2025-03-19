package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;

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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리 안함


                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/core/auth/signup",
                                "/api/core/auth/login",
                                "/api/core/hobbies",
                                "/api/core/hobbies/simple",
                                "/api/core/hobbies/categories",
                                "/api/core/hobbies/*/categories",
                                "/api/core/hobbies/categories/*",
                                "/api/core/profiles/user/*",
                                "/api/core/market/products/requests/approved",
                                "/api/core/market/products/all",
                                "/api/core/market/products/all/filter",
                                "/api/core/market/products/images/**",
                                "/api/core/market/products/{id}",

                                "/ws/**",  // WebSocket 경로 인증 없이 허용
                                "/topic/**"
                        ).permitAll()

                        .requestMatchers("/api/core/profiles/admin/**").hasRole("ADMIN")

                        .requestMatchers(
                                "/api/core/market/products/registers",
                                "/api/core/market/products/requests",
                                "/api/core/market/products/requests/approve",
                                "/api/core/market/products/users/**",
                                "/api/core/market/products/nearby",
                                "/api/core/market/transactions",
                                "/api/core/market/transactions/**",
                                "/api/core/market/payments",
                                "/api/core/market/payments/**"

                        ).authenticated()

                        .anyRequest().authenticated()
                )

                // WebSocket 요청에 대해 JWT 필터 제외
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, jwtTokenBlacklistService),
                        UsernamePasswordAuthenticationFilter.class);

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