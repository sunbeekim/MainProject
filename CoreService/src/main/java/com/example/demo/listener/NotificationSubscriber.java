package com.example.demo.listener;

import com.example.demo.dto.Market.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component  // 필수: Spring Bean으로 등록
@RequiredArgsConstructor
public class NotificationSubscriber implements MessageListener {
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            NotificationMessage notification = objectMapper.readValue(message.getBody(), NotificationMessage.class);
            messagingTemplate.convertAndSend("/topic/user/" + notification.getReceiverEmail(), notification);
            System.out.println("🔔 Redis에서 알림 수신: " + notification.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
