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
    void saveChatMessage(ChatMessage chatMessage);
    
    // 메시지 조회 (메시지 ID로)
    ChatMessage findMessageById(Integer messageId);
    
    // 채팅방의 메시지 목록 조회 (페이징 처리)
    List<ChatMessage> findMessagesByChatRoomId(
            @Param("chatroomId") Integer chatroomId,
            @Param("offset") Integer offset,
            @Param("limit") Integer limit);
    
    // 채팅방의 전체 메시지 수 조회
    Integer countMessagesByChatRoomId(Integer chatroomId);
    
    // 메시지 읽음 상태 업데이트
    void updateMessageReadStatus(
            @Param("chatroomId") Integer chatroomId,
            @Param("receiverEmail") String receiverEmail);
}
