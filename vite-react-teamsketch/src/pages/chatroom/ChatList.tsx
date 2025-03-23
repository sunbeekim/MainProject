import React from "react";
import { useState, useEffect } from "react";
import ChatListItem from "./ChatListItem"; 
import { useChatRooms, ChatRoom } from "../../services/api/userChatAPI";
import Loading from "../../components/common/Loading";

const ChatList: React.FC = () => {
  const { data: chatRooms, isLoading, isError, error } = useChatRooms();
  const [mockChats, setMockChats] = useState<ChatRoom[]>([]);
  console.log(chatRooms);
  // 날짜를 "3시간 전", "방금 전" 등의 형식으로 변환하는 간단한 함수
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      
      // 시간 차이 계산
      const diffInSec = Math.floor(diffInMs / 1000);
      const diffInMin = Math.floor(diffInSec / 60);
      const diffInHours = Math.floor(diffInMin / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      // 적절한 형식으로 반환
      if (diffInSec < 60) return '방금 전';
      if (diffInMin < 60) return `${diffInMin}분 전`;
      if (diffInHours < 24) return `${diffInHours}시간 전`;
      if (diffInDays < 7) return `${diffInDays}일 전`;
      
      // 그 외에는 날짜를 간단히 표시
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return dateString;
    }
  };

  // API 호출이 실패한 경우 대체할 목업 데이터
  useEffect(() => {
    // API에서 데이터를 가져오지 못한 경우 목업 데이터 사용
    if (isError) {
      console.error('채팅방 목록 조회 실패:', error);
      setMockChats([
        {
          chatroomId: 1,
          chatname: "상품명 거래 채팅",
          productId: 1,
          productName: "전자제품 거래",
          productImageUrl: "https://picsum.photos/600/400",
          sellerEmail: "seller@example.com",
          buyerEmail: "buyer@example.com",
          otherUserEmail: "seller@example.com",
          otherUserName: "곰탱이",
          lastMessage: "안녕하세요",
          lastMessageTime: "2023-11-01T12:05:00",
          status: "ACTIVE",
          createdAt: "2023-11-01T12:00:00",
          updatedAt: "2023-11-01T12:05:00",
          unreadCount: 2
        },
        {
          chatroomId: 2,
          chatname: "옷 거래 채팅",
          productId: 2,
          productName: "의류 거래",
          productImageUrl: "https://picsum.photos/600/400",
          sellerEmail: "seller2@example.com",
          buyerEmail: "buyer@example.com",
          otherUserEmail: "seller2@example.com",
          otherUserName: "집순이",
          lastMessage: "반가워요",
          lastMessageTime: "2023-11-01T10:30:00",
          status: "ACTIVE",
          createdAt: "2023-11-01T10:00:00",
          updatedAt: "2023-11-01T10:30:00",
          unreadCount: 0
        },
        {
          chatroomId: 3,
          chatname: "도서 거래 채팅",
          productId: 3,
          productName: "책 거래",
          productImageUrl: "https://picsum.photos/600/400",
          sellerEmail: "seller3@example.com",
          buyerEmail: "buyer@example.com",
          otherUserEmail: "seller3@example.com",
          otherUserName: "알라딘딘",
          lastMessage: "어디세요?",
          lastMessageTime: "2023-11-01T09:00:00",
          status: "ACTIVE",
          createdAt: "2023-11-01T08:00:00",
          updatedAt: "2023-11-01T09:00:00",
          unreadCount: 3
        }
      ]);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  // 채팅방이 없는 경우
  if ((!chatRooms || chatRooms.length === 0) && (!mockChats || mockChats.length === 0)) {
    return (
      <div className="flex justify-center items-center h-full flex-col">
        <div className="text-gray-500 text-xl mb-3">
          <i className="fas fa-comments text-3xl"></i>
        </div>
        <p className="text-gray-500">진행 중인 채팅이 없습니다.</p>
      </div>
    );
  }

  // API에서 가져온 데이터나 목업 데이터를 사용하여 채팅방 목록 표시
  const displayChats = chatRooms || mockChats;

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 w-full">
        {displayChats.map((chat) => (
          <ChatListItem
            key={chat.chatroomId}
            nickname={chat.otherUserName}
            lastMessage={chat.lastMessage}
            time={formatTime(chat.lastMessageTime)}
            imageUrl={chat.productImageUrl}
            unreadCount={chat.unreadCount}
            email={chat.otherUserEmail}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
