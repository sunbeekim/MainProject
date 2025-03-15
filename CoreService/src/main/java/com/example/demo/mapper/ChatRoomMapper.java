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
    
    // 채팅방 ID로 채팅방 조회 - 매개변수 순서 수정
    ChatRoom findChatRoomById(@Param("chatroomId") Integer chatroomId, @Param("email") String email);
    
    // 상품 ID와 구매자 이메일로 채팅방 조회
    ChatRoom findChatRoomByProductAndBuyer(
            @Param("productId") Long productId, 
            @Param("buyerEmail") String buyerEmail);
    
    // 사용자와 관련된 채팅방 목록 조회
    List<ChatRoom> findChatRoomsByUser(@Param("email") String email);
    
    // 채팅방 정보 업데이트
    void updateChatRoom(ChatRoom chatRoom);
    
    // 채팅방 상태 변경
    void updateChatRoomStatus(
            @Param("chatroomId") Integer chatroomId, 
            @Param("status") String status);
}
