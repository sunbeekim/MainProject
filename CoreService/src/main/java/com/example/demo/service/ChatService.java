package com.example.demo.service;

import com.example.demo.dto.chat.*;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.mapper.ChatRoomMapper;
import com.example.demo.mapper.ChatMessageMapper;
import com.example.demo.mapper.Market.ProductMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.mapper.Market.ProductImageMapper;
import com.example.demo.model.Market.Product;
import com.example.demo.model.Market.ProductImage;
import com.example.demo.model.User;
import com.example.demo.model.chat.ChatMessage;
import com.example.demo.model.chat.ChatRoom;
import com.example.demo.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomMapper chatRoomMapper;
    private final ChatMessageMapper chatMessageMapper;
    private final ProductMapper productMapper;
    private final UserMapper userMapper;
    private final TokenUtils tokenUtils;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final ProductImageMapper productImageMapper;  // 추가된 의존성

    /**
     * 채팅방 생성 또는 조회
     */
    @Transactional
    public ChatRoomResponse createOrGetChatRoom(String userEmail, ChatRoomRequest request) {
        // 상품 존재 여부 검증 (email 매개변수 추가)
        Product product = productMapper.findById(request.getProductId(), userEmail);
        if (product == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("존재하지 않는 상품입니다.")
                    .build();
        }
        
        // 판매자 이메일 가져오기 (상품에서 조회)
        String sellerEmail = product.getEmail();
        
        // 자신의 상품에 대해 채팅방 생성 불가
        if (sellerEmail.equals(userEmail)) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("자신이 등록한 상품에 대해 채팅을 시작할 수 없습니다.")
                    .build();
        }
        
        // 구매자는 현재 사용자
        String buyerEmail = userEmail;
        
        // 해당 상품에 대한 채팅방이 이미 존재하는지 확인
        ChatRoom existingChatRoom = chatRoomMapper.findChatRoomByProductAndBuyer(
                request.getProductId(), buyerEmail);
        
        ChatRoom chatRoom;
        boolean isNewChatRoom = false;
        
        if (existingChatRoom == null) {
            // 새 채팅방 생성
            chatRoom = ChatRoom.builder()
                    .chatname(product.getTitle() + " 거래 채팅")
                    .productId(product.getId())
                    .buyerEmail(buyerEmail)
                    .lastMessage("채팅이 시작되었습니다.")
                    .lastMessageTime(LocalDateTime.now())
                    .status("ACTIVE")
                    .build();
            
            chatRoomMapper.createChatRoom(chatRoom);
            
            // 시스템 메시지 저장 (채팅방 생성 메시지)
            // 시스템 메시지를 실제 사용자 이메일로 변경 (구매자로 설정)
            ChatMessage systemMessage = ChatMessage.builder()
                    .chatroomId(chatRoom.getChatroomId())
                    .senderEmail(buyerEmail) // "system" 대신 구매자 이메일 사용
                    .content("채팅이 시작되었습니다.")
                    .messageType("SYSTEM") // 메시지 타입은 SYSTEM으로 유지
                    .sentAt(LocalDateTime.now())
                    .isRead(false)
                    .build();
            
            chatMessageMapper.saveChatMessage(systemMessage);
            isNewChatRoom = true;
        } else {
            // 기존 채팅방 사용
            chatRoom = existingChatRoom;
        }
        
        // 사용자 정보 조회
        User seller = userMapper.findByEmail(sellerEmail);
        User buyer = userMapper.findByEmail(buyerEmail);
        
        // 썸네일 이미지 경로 가져오기
        String thumbnailPath = null;
        List<ProductImage> images = productImageMapper.findByProductId(product.getId());
        for (ProductImage image : images) {
            if (image.getIsThumbnail()) {
                thumbnailPath = image.getImagePath();
                break;
            }
        }
        // 썸네일 없으면 첫 번째 이미지 사용
        if (thumbnailPath == null && !images.isEmpty()) {
            thumbnailPath = images.get(0).getImagePath();
        }
        
        // 상대방 정보 설정
        String otherUserEmail = sellerEmail.equals(userEmail) ? buyerEmail : sellerEmail;
        String otherUserName = sellerEmail.equals(userEmail) ? buyer.getNickname() : seller.getNickname();
        
        return ChatRoomResponse.builder()
                .success(true)
                .message(isNewChatRoom ? "새 채팅방이 생성되었습니다." : "기존 채팅방을 조회했습니다.")
                .chatroomId(chatRoom.getChatroomId())
                .chatname(chatRoom.getChatname())
                .productId(chatRoom.getProductId())
                .productName(product.getTitle())
                .productImageUrl(thumbnailPath)
                .sellerEmail(sellerEmail)
                .buyerEmail(chatRoom.getBuyerEmail())
                .otherUserEmail(otherUserEmail)
                .otherUserName(otherUserName)
                .lastMessage(chatRoom.getLastMessage())
                .lastMessageTime(chatRoom.getLastMessageTime())
                .createdAt(chatRoom.getCreatedAt())
                .build();
    }

    /**
     * 사용자의 채팅방 목록 조회
     */
    public ChatRoomResponse getChatRoomsByUser(String userEmail) {
        // userEmail 매개변수 추가
        List<ChatRoom> chatRooms = chatRoomMapper.findChatRoomsByUser(userEmail);
        List<ChatRoom> enhancedChatRooms = new ArrayList<>();
        
        for (ChatRoom room : chatRooms) {
            // 상품 정보 조회 (email 매개변수 추가)
            Product product = productMapper.findById(room.getProductId(), userEmail);
            if (product == null) {
                continue; // 상품이 삭제된 경우 건너뜀
            }
            
            // 상대방 정보 설정
            String sellerEmail = product.getEmail(); // 상품 판매자 이메일
            String otherUserEmail = sellerEmail.equals(userEmail) ? 
                    room.getBuyerEmail() : sellerEmail;
            
            User otherUser = userMapper.findByEmail(otherUserEmail);
            if (otherUser == null) {
                continue; // 상대방 사용자 정보가 없는 경우 건너뜀
            }
            
            // 이미지 정보 조회 (ProductImages 테이블에서)
            String thumbnailPath = null;
            List<ProductImage> images = productImageMapper.findByProductId(room.getProductId());
            for (ProductImage image : images) {
                if (image.getIsThumbnail()) {
                    thumbnailPath = image.getImagePath();
                    break;
                }
            }
            // 썸네일 없으면 첫 번째 이미지 사용
            if (thumbnailPath == null && !images.isEmpty()) {
                thumbnailPath = images.get(0).getImagePath();
            }
            
            // 추가 정보 설정
            room.setProductName(product.getTitle());
            room.setProductImageUrl(thumbnailPath);
            room.setOtherUserName(otherUser.getNickname());
            room.setSellerEmail(sellerEmail); // 판매자 이메일 설정
            
            enhancedChatRooms.add(room);
        }
        
        return ChatRoomResponse.builder()
                .success(true)
                .message("채팅방 목록 조회 성공")
                .chatRooms(enhancedChatRooms)
                .build();
    }

    /**
     * 채팅방 상세 정보 조회
     */
    public ChatRoomResponse getChatRoomDetail(String userEmail, Integer chatroomId) {
        // 채팅방 존재 여부 확인 - email 매개변수 추가
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(chatroomId, userEmail);
        if (chatRoom == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("존재하지 않는 채팅방입니다.")
                    .build();
        }
        
        // 상품 정보 조회 (email 매개변수 추가)
        Product product = productMapper.findById(chatRoom.getProductId(), userEmail);
        if (product == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("상품 정보를 찾을 수 없습니다.")
                    .build();
        }
        
        String sellerEmail = product.getEmail(); // 상품 판매자 이메일
        String buyerEmail = chatRoom.getBuyerEmail();
        
        // 채팅방 참여자 검증
        if (!sellerEmail.equals(userEmail) && !buyerEmail.equals(userEmail)) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("해당 채팅방에 접근 권한이 없습니다.")
                    .build();
        }
        
        // 썸네일 이미지 경로 가져오기
        String thumbnailPath = null;
        List<ProductImage> images = productImageMapper.findByProductId(product.getId());
        for (ProductImage image : images) {
            if (image.getIsThumbnail()) {
                thumbnailPath = image.getImagePath();
                break;
            }
        }
        // 썸네일 없으면 첫 번째 이미지 사용
        if (thumbnailPath == null && !images.isEmpty()) {
            thumbnailPath = images.get(0).getImagePath();
        }
        
        // 상대방 정보 설정
        String otherUserEmail = sellerEmail.equals(userEmail) ? 
                buyerEmail : sellerEmail;
        
        User otherUser = userMapper.findByEmail(otherUserEmail);
        if (otherUser == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("상대방 정보를 찾을 수 없습니다.")
                    .build();
        }
        
        // 메시지 읽음 상태 업데이트
        chatMessageMapper.updateMessageReadStatus(chatroomId, userEmail);
        
        return ChatRoomResponse.builder()
                .success(true)
                .message("채팅방 조회 성공")
                .chatroomId(chatRoom.getChatroomId())
                .chatname(chatRoom.getChatname())
                .productId(chatRoom.getProductId())
                .productName(product.getTitle())
                .productImageUrl(thumbnailPath)
                .sellerEmail(sellerEmail)
                .buyerEmail(buyerEmail)
                .otherUserEmail(otherUserEmail)
                .otherUserName(otherUser.getNickname())
                .lastMessage(chatRoom.getLastMessage())
                .lastMessageTime(chatRoom.getLastMessageTime())
                .createdAt(chatRoom.getCreatedAt())
                .build();
    }
}