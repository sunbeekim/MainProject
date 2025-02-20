package com.example.demo.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.filter.JwtAuthenticationFilter;

@Configuration
public class RouteConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Core Service - Docker Network
            .route("coreService-docker", r -> r
                .path("/api/core/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("http://core-container:8081"))
            
            // Core Service - External Domain
            .route("coreService-domain", r -> r
                .path("/api/core/**")
                .and()
                .header("X-Route-Type", "external")
                .uri("http://sunbee.world:8081"))
            
            // Assist Service - Docker Network
            .route("assistService-docker", r -> r
                .path("/api/assist/**")
                .filters(f -> f
                    .filter(jwtFilter.apply(new JwtAuthenticationFilter.Config()))
                    .rewritePath("/api/assist/(?<segment>.*)", "/api/assist/${segment}"))
                .uri("http://assist-container:8082"))
            
            // Assist Service - External Domain
            .route("assistService-domain", r -> r
                .path("/api/assist/**")
                .and()
                .header("X-Route-Type", "external")
                .filters(f -> f
                    .rewritePath("/api/assist/(?<segment>.*)", "/api/assist/${segment}"))
                .uri("http://sunbee.world:8082"))
            
            .build();
    }
} 