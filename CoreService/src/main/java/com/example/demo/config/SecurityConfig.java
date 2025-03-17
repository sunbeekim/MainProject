package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.security.JwtAuthenticationEntryPoint;
import com.example.demo.security.oauth2.CustomOAuth2UserService;
import com.example.demo.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.example.demo.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.example.demo.security.oauth2.OAuth2AuthenticationFailureHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenBlacklistService jwtTokenBlacklistService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    private final AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint; // 추가

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리 안함
                .exceptionHandling(exceptionHandling -> 
                    exceptionHandling.authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth
                        // 인증이 필요 없는 API (모든 사용자 접근 가능)
                        .requestMatchers(
                                // 정적 리소스에 대한 접근 허용
                                "/profile-images/**",
                                "/chat-images/**",
                                "/uploads/**",

                                "/api/core/auth/signup",
                                "/api/core/auth/login",
                                "/api/core/auth/logout", // 로그아웃 경로 추가
                                "/api/core/auth/me/password/notoken",
                                "/api/core/auth/me/password",
                                "/api/core/hobbies",
                                "/api/core/hobbies/simple", // 추가된 API 경로
                                "/api/core/hobbies/categories",
                                "/api/core/hobbies/*/categories",
                                "/api/core/hobbies/categories/*", // 카테고리별 취미 목록 조회 접근 허용
                                "/api/core/profiles/user/*", // 닉네임으로 공개 프로필 조회는 인증 없이 접근 가능
                                "/api/core/market/*",
                                "/ws/**",
                                "/api/core/market/products/requests/approved",
                                "/api/core/market/products/requests/complete",
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
                                "/api/core/chat/messages/**")
                        .permitAll()
                        .requestMatchers("/api/core/profiles/admin/**").hasRole("ADMIN") // 관리자 전용 API

                        // 인증이 필요한 API
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

                        .anyRequest().authenticated() // 그 외 요청은 인증 필요
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtTokenProvider, jwtTokenBlacklistService),
                        UsernamePasswordAuthenticationFilter.class
                )
                // 커스텀 로그아웃 처리를 위해 Spring Security의 기본 로그아웃 비활성화
                .logout(logout -> logout.disable())
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint
                                .baseUri("/api/core/auth/oauth2/authorize")
                                .authorizationRequestRepository(authorizationRequestRepository)
                        )
                        .redirectionEndpoint(endpoint -> endpoint
                                .baseUri("/api/core/auth/oauth2/callback/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler)
                );
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
