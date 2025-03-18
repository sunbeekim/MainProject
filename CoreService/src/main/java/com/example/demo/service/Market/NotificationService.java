package com.example.demo.service.Market;
/** 상품 요청 발생 시 이메일 및 푸시 알림 전송 **/

import com.example.demo.dto.Market.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class NotificationService {
    /** 상품 요청 발생 시 이메일 및 푸시 알림 전송 **/
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic topic;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String receiverEmail, String message) {
        NotificationMessage notification = new NotificationMessage(receiverEmail, message);

        // Redis Pub/Sub으로 알림 전송
        redisTemplate.convertAndSend(topic.getTopic(), notification); // converAndSend = 알림을 발행함 여러 서버 실시간 동기화

        // WebSocket을 통해 클라이언트에게 즉시 전송
        messagingTemplate.convertAndSend("/topic/user/" + receiverEmail, notification);
        // 등록자뿐만 아닌 특정 사용자에게도 알람 전송 "요청자"

    }
}
