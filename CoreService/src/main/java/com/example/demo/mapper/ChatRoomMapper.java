package com.example.demo.mapper;

import com.example.demo.model.chat.ChatRoom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ChatRoomMapper {

    // 채팅방 생성
    void createChatRoom(ChatRoom chatRoom);
    
    // 채팅방 조회 (채팅방 ID로)
    ChatRoom findChatRoomById(Integer chatroomId);
    
    // 특정 상품에 대한 구매자의 채팅방 조회 (sellerEmail 매개변수 제거)
    ChatRoom findChatRoomByProductAndBuyer(
            @Param("productId") Long productId,
            @Param("buyerEmail") String buyerEmail);
    
    // 사용자가 참여한 모든 채팅방 조회 (판매자 또는 구매자로)
    List<ChatRoom> findChatRoomsByUser(String email);
    
    // 판매자로 참여한 채팅방 목록 조회
    List<ChatRoom> findChatRoomsBySeller(String sellerEmail);
    
    // 구매자로 참여한 채팅방 목록 조회
    List<ChatRoom> findChatRoomsByBuyer(String buyerEmail);
    
    // 채팅방의 마지막 메시지 및 시간 업데이트
    void updateChatRoomLastMessage(
            @Param("chatroomId") Integer chatroomId,
            @Param("lastMessage") String lastMessage,
            @Param("lastMessageTime") java.time.LocalDateTime lastMessageTime);
}
