package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트에서 구독할 주제 경로 설정
        registry.enableSimpleBroker("/topic", "/redis"); 
        
        // 클라이언트에서 서버로 메시지를 전송할 때 사용할 접두사
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결 엔드포인트 설정
        registry.addEndpoint("/ws", "/ws/redis")
                .setAllowedOriginPatterns("*") // 실제 환경에서는 특정 도메인으로 제한하는 것이 좋습니다
                .withSockJS(); // SockJS 지원 활성화
    }
}
