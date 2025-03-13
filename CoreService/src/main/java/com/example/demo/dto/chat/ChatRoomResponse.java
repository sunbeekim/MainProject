package com.example.demo.dto.chat;

import com.example.demo.model.chat.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private boolean success;
    private String message;
    
    // 채팅방 기본 정보
    private Integer chatroomId;
    private String chatname;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String sellerEmail;
    private String buyerEmail;
    private String otherUserEmail;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Integer unreadCount;
    private LocalDateTime createdAt;
    
    // 채팅방 목록 조회 시 사용
    private List<ChatRoom> chatRooms;
}
