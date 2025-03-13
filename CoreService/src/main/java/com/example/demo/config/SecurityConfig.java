package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;
import com.example.demo.security.JwtTokenBlacklistService;
import com.example.demo.security.JwtTokenProvider;

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
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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
                                "/api/core/market/products/{id}"
                        ).permitAll()

                        .requestMatchers("/api/core/profiles/admin/**").hasRole("ADMIN")

                        .requestMatchers(
                                "/api/core/market/products/registers",
                                "/api/core/market/products/requests",
                                "/api/core/market/products/requests/approve",
                                "/api/core/market/products/users/**"
                        ).authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, jwtTokenBlacklistService),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}