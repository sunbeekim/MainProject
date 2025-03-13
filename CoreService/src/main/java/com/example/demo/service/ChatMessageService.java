package com.example.demo.service;

import com.example.demo.dto.chat.ChatMessageRequest;
import com.example.demo.dto.chat.ChatMessagesResponse;
import com.example.demo.mapper.ChatMessageMapper;
import com.example.demo.mapper.ChatRoomMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.model.chat.ChatMessage;
import com.example.demo.model.chat.ChatRoom;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageService {

    private final ChatMessageMapper chatMessageMapper;
    private final ChatRoomMapper chatRoomMapper;
    private final UserMapper userMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final ObjectMapper objectMapper;
    
    /**
     * 채팅 메시지 전송 처리
     * - 메시지를 DB에 저장하고 Redis를 통해 발행
     */
    @Transactional
    public ChatMessage sendMessage(String senderEmail, ChatMessageRequest request) {
        // 채팅방 존재 여부 확인
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(request.getChatroomId());
        if (chatRoom == null) {
            throw new IllegalArgumentException("존재하지 않는 채팅방입니다.");
        }
        
        String sellerEmail = chatRoom.getSellerEmail(); // JOIN으로 가져온 판매자 이메일
        String buyerEmail = chatRoom.getBuyerEmail();
        
        // 사용자가 해당 채팅방의 참여자인지 확인
        if (!sellerEmail.equals(senderEmail) && !buyerEmail.equals(senderEmail)) {
            throw new IllegalArgumentException("해당 채팅방에 접근 권한이 없습니다.");
        }
        
        // 메시지 저장을 위한 객체 생성
        ChatMessage chatMessage = ChatMessage.builder()
                .chatroomId(request.getChatroomId())
                .senderEmail(senderEmail)
                .content(request.getContent())
                .messageType(request.getMessageType())
                .isRead(false)
                .sentAt(LocalDateTime.now())
                .build();
        
        // DB에 메시지 저장
        chatMessageMapper.saveChatMessage(chatMessage);
        
        // 사용자 정보 조회하여 추가 정보 설정
        User sender = userMapper.findByEmail(senderEmail);
        chatMessage.setSenderName(sender.getNickname());
        
        // 프로필 이미지가 있으면 URL 생성
        String profileImageUrl = null;
        if (sender.getProfileImagePath() != null) {
            profileImageUrl = "/api/core/profiles/image/" + sender.getProfileImagePath();
        }
        chatMessage.setSenderProfileUrl(profileImageUrl);
        
        // 채팅방의 마지막 메시지 및 시간 업데이트
        chatRoomMapper.updateChatRoomLastMessage(
                request.getChatroomId(),
                request.getContent(),
                chatMessage.getSentAt()
        );
        
        // Redis를 통해 메시지 발행 (pub/sub)
        publishMessage(chatMessage);
        
        return chatMessage;
    }
    
    /**
     * Redis를 통해 메시지 발행
     */
    private void publishMessage(ChatMessage message) {
        try {
            // 메시지를 JSON으로 직렬화
            String messageJson = objectMapper.writeValueAsString(message);
            
            // Redis 채널에 메시지 발행
            redisTemplate.convertAndSend(
                    channelTopic.getTopic(),
                    messageJson
            );
            
            log.info("Message published to Redis channel: {}", channelTopic.getTopic());
        } catch (JsonProcessingException e) {
            log.error("Error converting message to JSON: {}", e.getMessage());
        }
    }
    
    /**
     * 채팅방의 메시지 목록 조회 (페이징 처리)
     */
    public ChatMessagesResponse getChatMessages(Integer chatroomId, Integer page, Integer size) {
        // 기본값 설정
        if (page == null || page < 0) page = 0;
        if (size == null || size < 1) size = 20;
        
        // 채팅방 존재 여부 확인
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(chatroomId);
        if (chatRoom == null) {
            return ChatMessagesResponse.builder()
                    .success(false)
                    .message("존재하지 않는 채팅방입니다.")
                    .build();
        }
        
        // offset 계산 
        int offset = page * size;
        
        // 메시지 총 개수 조회
        Integer totalCount = chatMessageMapper.countMessagesByChatRoomId(chatroomId);
        Integer totalPages = (totalCount + size - 1) / size;
        
        // 채팅 메시지 목록 조회 (최신순)
        List<ChatMessage> messages = chatMessageMapper.findMessagesByChatRoomId(chatroomId, offset, size);
        
        // 발신자 정보 보강
        for (ChatMessage message : messages) {
            // 시스템 메시지는 건너뛰기
            if ("system".equals(message.getSenderEmail())) {
                message.setSenderName("시스템");
                continue;
            }
            
            User sender = userMapper.findByEmail(message.getSenderEmail());
            if (sender != null) {
                message.setSenderName(sender.getNickname());
                
                // 프로필 이미지가 있으면 URL 생성
                if (sender.getProfileImagePath() != null) {
                    message.setSenderProfileUrl("/api/core/profiles/image/" + sender.getProfileImagePath());
                }
            }
        }
        
        return ChatMessagesResponse.builder()
                .success(true)
                .message("메시지 조회 성공")
                .messages(messages)
                .totalCount(totalCount)
                .totalPages(totalPages)
                .currentPage(page)
                .build();
    }
}
