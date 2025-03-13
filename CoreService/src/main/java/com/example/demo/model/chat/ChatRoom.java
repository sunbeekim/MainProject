package com.example.demo.model.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    private Integer chatroomId;
    private String chatname;
    private Long productId;
    private String buyerEmail;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 추가 필드 - 웹소켓 관련 및 UI 표시용
    private String productName;  // 상품명
    private String productImageUrl; // 상품 이미지 URL
    private Integer unreadCount;  // 읽지 않은 메시지 수
    private String sellerEmail;  // JOIN을 통해 조회되는 판매자 이메일
    private String otherUserName; // 상대방 이름 (판매자 또는 구매자)
    private String otherUserProfileUrl; // 상대방 프로필 이미지
}