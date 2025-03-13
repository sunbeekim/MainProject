package com.example.demo.listener;

import com.example.demo.model.chat.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisMessageListener implements MessageListener {

    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // Redis에서 수신한 메시지 처리
            String publishedMessage = redisTemplate.getStringSerializer().deserialize(message.getBody());
            log.info("Received message from Redis channel: {}", publishedMessage);
            
            // JSON 문자열을 ChatMessage 객체로 변환
            ChatMessage chatMessage = objectMapper.readValue(publishedMessage, ChatMessage.class);
            
            // STOMP를 통해 클라이언트에게 메시지 전송
            String destination = "/topic/chat." + chatMessage.getChatroomId();
            messagingTemplate.convertAndSend(destination, chatMessage);
            log.info("Message sent to WebSocket clients at destination: {}", destination);
            
        } catch (Exception e) {
            log.error("Error processing Redis message: {}", e.getMessage());
        }
    }
}
