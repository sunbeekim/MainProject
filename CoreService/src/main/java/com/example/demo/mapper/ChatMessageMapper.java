package com.example.demo.mapper;

import com.example.demo.model.chat.ChatMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ChatMessageMapper {
    
    // 메시지 저장
    void saveChatMessage(ChatMessage message);
    
    // 메시지 ID로 메시지 조회
    ChatMessage findMessageById(int messageId);
    
    // 채팅방 메시지 목록 조회 (페이징 처리)
    List<ChatMessage> findMessagesByChatRoomId(
            @Param("chatroomId") Integer chatroomId, 
            @Param("offset") int offset, 
            @Param("limit") int limit);
    
    // 채팅방 메시지 총 개수
    int countMessagesByChatRoomId(Integer chatroomId);
    
    // 메시지 읽음 상태 업데이트
    void updateMessageReadStatus(
            @Param("chatroomId") Integer chatroomId, 
            @Param("receiverEmail") String receiverEmail);

    /**
     * 읽지 않은 메시지 개수 조회
     */
    int countUnreadMessages(
            @Param("chatroomId") Integer chatroomId, 
            @Param("receiverEmail") String receiverEmail);
}
