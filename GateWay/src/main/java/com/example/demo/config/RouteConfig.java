package com.example.demo.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class RouteConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        // URI를 final로 선언
        final String coreUri = "prod".equals(activeProfile) 
            ? "http://core-container:8081" 
            : "http://localhost:8081";
            
        final String assistUri = "prod".equals(activeProfile)
            ? "http://assist-container:8082"
            : "http://localhost:8082";

        return builder.routes()
            // Core Service
            .route("coreService", r -> r
                .path("/api/core/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(coreUri))
            
            // Assist Service
            .route("assistService", r -> r
                .path("/api/assist/**")
                .filters(f -> f
                    .filter(jwtFilter.apply(new JwtAuthenticationFilter.Config()))
                    .rewritePath("/api/assist/(?<segment>.*)", "/api/assist/${segment}"))
                .uri(assistUri))
            .build();
    }
} 