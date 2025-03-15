package com.example.demo.service;

import com.example.demo.dto.chat.ChatMessageRequest;
import com.example.demo.dto.chat.ChatMessagesResponse;
import com.example.demo.mapper.ChatMessageMapper;
import com.example.demo.mapper.ChatRoomMapper;
import com.example.demo.mapper.Market.ProductMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.Market.Product;
import com.example.demo.model.User;
import com.example.demo.model.chat.ChatMessage;
import com.example.demo.model.chat.ChatRoom;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    private final ProductMapper productMapper;
    private final UserMapper userMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final ObjectMapper objectMapper;
    
    @Value("${chat.default.page-size:20}")
    private int defaultPageSize;

    /**
     * 메시지 전송
     */
    @Transactional
    public ChatMessage sendMessage(String senderEmail, ChatMessageRequest request) {
        // 채팅방 존재 여부 확인
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(request.getChatroomId(), senderEmail);
        if (chatRoom == null) {
            throw new IllegalArgumentException("존재하지 않는 채팅방입니다.");
        }
        
        // 채팅방과 연결된 상품 정보 가져오기
        Product product = productMapper.findById(chatRoom.getProductId(), senderEmail);
        if (product == null) {
            throw new IllegalArgumentException("상품 정보를 찾을 수 없습니다.");
        }
        
        // 판매자 이메일 설정 - product에서 가져옴
        String sellerEmail = product.getEmail();
        String buyerEmail = chatRoom.getBuyerEmail();
        
        // 사용자가 해당 채팅방의 멤버인지 확인 (판매자 또는 구매자)
        if (!senderEmail.equals(sellerEmail) && !senderEmail.equals(buyerEmail)) {
            throw new IllegalArgumentException("해당 채팅방에 접근 권한이 없습니다.");
        }
        
        // 메시지 생성
        ChatMessage message = ChatMessage.builder()
                .chatroomId(request.getChatroomId())
                .senderEmail(senderEmail)
                .content(request.getContent())
                .messageType(request.getMessageType())
                .sentAt(LocalDateTime.now())
                .isRead(false)
                .build();
        
        // 메시지 저장
        chatMessageMapper.saveChatMessage(message);
        
        // 채팅방 정보 업데이트 (마지막 메시지, 시간)
        chatRoom.setLastMessage(message.getContent());
        chatRoom.setLastMessageTime(message.getSentAt());
        chatRoomMapper.updateChatRoom(chatRoom);
        
        // 발신자 정보 추가 (for 실시간 메시지)
        User sender = userMapper.findByEmail(senderEmail);
        if (sender != null) {
            message.setSenderName(sender.getNickname());
        }
        
        try {
            // Redis를 통해 메시지 발행
            redisTemplate.convertAndSend(channelTopic.getTopic(), message);
        } catch (Exception e) {
            log.error("Redis 메시지 발행 실패: {}", e.getMessage());
        }
        
        return message;
    }

    /**
     * 채팅방 메시지 목록 조회
     */
    public ChatMessagesResponse getChatMessages(Integer chatroomId, String userEmail, Integer page, Integer size) {
        // 채팅방 존재 여부 확인
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(chatroomId, userEmail);
        if (chatRoom == null) {
            return ChatMessagesResponse.builder()
                    .success(false)
                    .message("존재하지 않는 채팅방입니다.")
                    .build();
        }
        
        // 채팅방과 연결된 상품 정보 가져오기
        Product product = productMapper.findById(chatRoom.getProductId(), userEmail);
        if (product == null) {
            return ChatMessagesResponse.builder()
                    .success(false)
                    .message("상품 정보를 찾을 수 없습니다.")
                    .build();
        }
        
        // 판매자 이메일 설정
        String sellerEmail = product.getEmail();
        String buyerEmail = chatRoom.getBuyerEmail();
        
        // 사용자가 해당 채팅방의 멤버인지 확인
        if (!userEmail.equals(sellerEmail) && !userEmail.equals(buyerEmail)) {
            return ChatMessagesResponse.builder()
                    .success(false)
                    .message("해당 채팅방에 접근 권한이 없습니다.")
                    .build();
        }
        
        // 페이징 처리
        int pageSize = (size != null && size > 0) ? size : defaultPageSize;
        int pageNum = (page != null && page >= 0) ? page : 0;
        int offset = pageNum * pageSize;
        
        // 메시지 목록 조회
        List<ChatMessage> messages = chatMessageMapper.findMessagesByChatRoomId(chatroomId, offset, pageSize);
        
        // 총 메시지 수
        int totalCount = chatMessageMapper.countMessagesByChatRoomId(chatroomId);
        int totalPages = (totalCount + pageSize - 1) / pageSize;
        
        // 메시지 읽음 상태 업데이트
        chatMessageMapper.updateMessageReadStatus(chatroomId, userEmail);
        
        return ChatMessagesResponse.builder()
                .success(true)
                .message("메시지 목록 조회 성공")
                .messages(messages)
                .totalCount(totalCount)
                .totalPages(totalPages)
                .currentPage(pageNum)
                .build();
    }

    /**
     * 메시지 읽음 상태 업데이트
     */
    public boolean markMessagesAsRead(Integer chatroomId, String receiverEmail) {
        // 채팅방 존재 여부 확인
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(chatroomId, receiverEmail);
        if (chatRoom == null) {
            throw new IllegalArgumentException("존재하지 않는 채팅방입니다.");
        }
        
        // 채팅방과 연결된 상품 정보 가져오기
        Product product = productMapper.findById(chatRoom.getProductId(), receiverEmail);
        if (product == null) {
            throw new IllegalArgumentException("상품 정보를 찾을 수 없습니다.");
        }
        
        String sellerEmail = product.getEmail();
        String buyerEmail = chatRoom.getBuyerEmail();
        
        // 사용자가 해당 채팅방의 멤버인지 확인
        if (!receiverEmail.equals(sellerEmail) && !receiverEmail.equals(buyerEmail)) {
            throw new IllegalArgumentException("해당 채팅방에 접근 권한이 없습니다.");
        }
        
        // 메시지 읽음 상태 업데이트
        chatMessageMapper.updateMessageReadStatus(chatroomId, receiverEmail);
        
        // 업데이트 된 메시지가 있는지 확인
        int unreadCount = chatMessageMapper.countUnreadMessages(chatroomId, receiverEmail);
        
        // 채팅방의 읽지 않은 메시지 카운트 업데이트
        // unreadCount가 0이 되었으므로 메시지를 모두 읽었다는 의미
        return unreadCount == 0;
    }
}
