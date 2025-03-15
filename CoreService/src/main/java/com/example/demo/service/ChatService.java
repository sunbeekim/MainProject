package com.example.demo.service;

import com.example.demo.dto.chat.*;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final ProductImageMapper productImageMapper;

    /**
     * 채팅방 생성 또는 조회
     */
    @Transactional
    public ChatRoomResponse createOrGetChatRoom(String userEmail, ChatRoomRequest request) {
        Product product = productMapper.findById(request.getProductId(), userEmail);
        if (product == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("존재하지 않는 상품입니다.")
                    .build();
        }
        
        String sellerEmail = product.getEmail();
        
        if (sellerEmail.equals(userEmail)) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("자신이 등록한 상품에 대해 채팅을 시작할 수 없습니다.")
                    .build();
        }
        
        String buyerEmail = userEmail;
        
        ChatRoom existingChatRoom = chatRoomMapper.findChatRoomByProductAndBuyer(
                request.getProductId(), buyerEmail);
        
        ChatRoom chatRoom;
        boolean isNewChatRoom = false;
        
        if (existingChatRoom == null) {
            chatRoom = ChatRoom.builder()
                    .chatname(product.getTitle() + " 거래 채팅")
                    .productId(product.getId())
                    .buyerEmail(buyerEmail)
                    .lastMessage("채팅이 시작되었습니다.")
                    .lastMessageTime(LocalDateTime.now())
                    .status("ACTIVE")
                    .build();
            
            chatRoomMapper.createChatRoom(chatRoom);
            
            ChatMessage systemMessage = ChatMessage.builder()
                    .chatroomId(chatRoom.getChatroomId())
                    .senderEmail(buyerEmail)
                    .content("채팅이 시작되었습니다.")
                    .messageType("SYSTEM")
                    .sentAt(LocalDateTime.now())
                    .isRead(false)
                    .build();
            
            chatMessageMapper.saveChatMessage(systemMessage);
            isNewChatRoom = true;
        } else {
            chatRoom = existingChatRoom;
        }
        
        User seller = userMapper.findByEmail(sellerEmail);
        User buyer = userMapper.findByEmail(buyerEmail);
        
        String thumbnailPath = getProductThumbnailImage(product.getId());
        
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
        List<ChatRoom> chatRooms = chatRoomMapper.findChatRoomsByUser(userEmail);
        List<ChatRoom> enhancedChatRooms = new ArrayList<>();
        
        for (ChatRoom room : chatRooms) {
            Product product = productMapper.findById(room.getProductId(), userEmail);
            if (product == null) {
                continue;
            }
            
            String sellerEmail = product.getEmail();
            String otherUserEmail = sellerEmail.equals(userEmail) ? 
                    room.getBuyerEmail() : sellerEmail;
            
            User otherUser = userMapper.findByEmail(otherUserEmail);
            if (otherUser == null) {
                continue;
            }
            
            String thumbnailPath = getProductThumbnailImage(room.getProductId());
            
            room.setProductName(product.getTitle());
            room.setProductImageUrl(thumbnailPath);
            room.setOtherUserName(otherUser.getNickname());
            room.setSellerEmail(sellerEmail);
            
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
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(chatroomId, userEmail);
        if (chatRoom == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("존재하지 않는 채팅방입니다.")
                    .build();
        }
        
        Product product = productMapper.findById(chatRoom.getProductId(), userEmail);
        if (product == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("상품 정보를 찾을 수 없습니다.")
                    .build();
        }
        
        String sellerEmail = product.getEmail();
        String buyerEmail = chatRoom.getBuyerEmail();
        
        if (!sellerEmail.equals(userEmail) && !buyerEmail.equals(userEmail)) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("해당 채팅방에 접근 권한이 없습니다.")
                    .build();
        }
        
        String thumbnailPath = getProductThumbnailImage(product.getId());
        
        String otherUserEmail = sellerEmail.equals(userEmail) ? 
                buyerEmail : sellerEmail;
        
        User otherUser = userMapper.findByEmail(otherUserEmail);
        if (otherUser == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("상대방 정보를 찾을 수 없습니다.")
                    .build();
        }
        
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
    
    /**
     * 상품 썸네일 이미지 가져오기
     */
    private String getProductThumbnailImage(Long productId) {
        String thumbnailPath = null;
        List<ProductImage> images = productImageMapper.findByProductId(productId);
        for (ProductImage image : images) {
            if (image.getIsThumbnail()) {
                thumbnailPath = image.getImagePath();
                break;
            }
        }
        if (thumbnailPath == null && !images.isEmpty()) {
            thumbnailPath = images.get(0).getImagePath();
        }
        return thumbnailPath;
    }
    
    /**
     * 채팅방 상태 업데이트
     */
    @Transactional
    public ChatRoomResponse updateChatRoomStatus(String userEmail, Integer chatroomId, String status) {
        ChatRoom chatRoom = chatRoomMapper.findChatRoomById(chatroomId, userEmail);
        if (chatRoom == null) {
            return ChatRoomResponse.builder()
                    .success(false)
                    .message("존재하지 않는 채팅방입니다.")
                    .build();
        }
        
        chatRoom.setStatus(status);
        chatRoomMapper.updateChatRoom(chatRoom);
        
        return ChatRoomResponse.builder()
                .success(true)
                .message("채팅방 상태가 업데이트되었습니다.")
                .build();
    }
}