package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Bean
    public ThreadPoolTaskScheduler messageBrokerTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("websocket-heartbeat-thread-");
        scheduler.initialize();
        return scheduler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결 엔드포인트 설정
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*"); // 개발 환경에서는 모든 오리진 허용
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트에서 구독할 주제 경로 설정
        registry.enableSimpleBroker("/topic", "/redis")
                .setTaskScheduler(messageBrokerTaskScheduler())
                .setHeartbeatValue(new long[] {10000, 10000}); // 하트비트 10초로 설정
        
        // 클라이언트에서 서버로 메시지를 전송할 때 사용할 접두사
        registry.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // 인바운드 채널 설정 (클라이언트 -> 서버)
        registration.taskExecutor()
                .corePoolSize(4)
                .maxPoolSize(10)
                .queueCapacity(25);
    }
    
    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        // 아웃바운드 채널 설정 (서버 -> 클라이언트)
        registration.taskExecutor()
                .corePoolSize(4)
                .maxPoolSize(10)
                .queueCapacity(25);
    }
    
    @Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        // JSON 메시지 변환기 추가
        messageConverters.add(new MappingJackson2MessageConverter());
        return false;
    }
}

