package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import com.example.demo.filter.JwtAuthenticationFilter;

@Configuration
public class RouteConfig {
    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    
    private String activeProfile = "prod";

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        System.out.println("=== RouteConfig 초기화 ===");
        System.out.println("현재 활성화된 프로필: " + activeProfile);
        
        final String coreUri = "prod".equals(activeProfile) 
            ? "http://core-container:8081" 
            : "http://localhost:8081";
      
        final String assistUri = "prod".equals(activeProfile)
            ? "http://assist-container:8082"
            : "http://localhost:8082";

        final String fastapiUri = "prod".equals(activeProfile)
            ? "http://fastapi-container:8001"
            : "http://localhost:8001";

        System.out.println("Core URI: " + coreUri);
        System.out.println("Assist URI: " + assistUri);
        System.out.println("FastAPI URI: " + fastapiUri);
       
        return builder.routes()
            .route("coreService", r -> r
                .path("/api/core/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(coreUri))
            .route("assistService", r -> r
                .path("/api/assist/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(assistUri))
            .route("fastapiService", r -> r
                .path("/api/fastapi/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri(fastapiUri))
            .build();
    }
}
