package com.example.demo.service.Market;

import com.example.demo.dto.Market.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor  // 자동으로 생성자 생성
public class NotificationService {
    /** 상품 요청 발생 시 이메일 및 푸시 알림 전송 **/
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    // 알림용 Topic을 명확하게 지정
    private final @Qualifier("notificationChannelTopic") ChannelTopic notificationChannelTopic;

    public void sendNotification(String receiverEmail, String message) {
        NotificationMessage notification = new NotificationMessage(receiverEmail, message);

        // Redis Pub/Sub으로 알림 전송
        redisTemplate.convertAndSend(notificationChannelTopic.getTopic(), notification);

        // WebSocket을 통해 클라이언트에게 즉시 전송
        messagingTemplate.convertAndSend("/topic/user/" + receiverEmail, notification);
    }
}

