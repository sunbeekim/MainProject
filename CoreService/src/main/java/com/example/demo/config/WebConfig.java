package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 실행 중에도 접근할 수 있도록 파일 저장 경로 변경
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/src/main/resources/static/uploads/");
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/ws/**") // 웹소켓 허용
                .allowedOriginPatterns("*") // allowedOrigins("*") → allowedOriginPatterns("*") 로 변경
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true); // allowCredentials 사용
    }

}
