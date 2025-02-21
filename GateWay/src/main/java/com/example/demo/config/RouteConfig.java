package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import reactor.core.publisher.Mono;
import com.example.demo.filter.JwtAuthenticationFilter;

@Configuration
public class RouteConfig {
    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        final String coreUri = "prod".equals(activeProfile) 
            ? "http://core-container:8081" 
            : "http://localhost:8081";
      
        final String assistUri = "prod".equals(activeProfile)
            ? "http://assist-container:8082"
            : "http://localhost:8082";

        final String fastapiUri = "prod".equals(activeProfile)
            ? "http://fastapi-container:8001"
            : "http://localhost:8001";

       
        return builder.routes()
            .route("coreService", r -> r
                .path("/api/core/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(coreUri))
            .route("assistService", r -> r
                .path("/api/assist/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(assistUri))
            // .route("fastapiService", r -> r
            //     .path("/api/fastapi/**")
            //     .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
            //     .uri(fastapiUri))
            .build();
    }
}