package com.example.demo.service.Market;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    /** 상품 요청 발생 시 이메일 및 푸시 알림 전송 **/
    public void sendNotification(String recipientEmail, String requesterEmail, Long productId) {
        String subject = "새로운 상품 요청 도착!";
        String message = "사용자 " + requesterEmail + "님이 상품 (ID: " + productId + ")에 대한 요청을 보냈습니다.";

        // 이메일 전송
        sendEmail(recipientEmail, subject, message);

        // 푸시 알림 전송
        sendPushNotification(recipientEmail, message);
    }

    private void sendEmail(String recipient, String subject, String message) {
        System.out.println("이메일 전송: " + recipient + " | 제목: " + subject + " | 내용: " + message);
    }

    private void sendPushNotification(String recipient, String message) {
        System.out.println("푸시 알림 전송: " + recipient + " | 내용: " + message);
    }
}
