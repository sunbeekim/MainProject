import React from "react";
import ChatListItem from "./ChatListItem"; 
import { useEffect } from "react";
interface Chat {
  id: number;
  nickname: string;
  lastMessage: string;
  time: string;
  imageUrl: string;
  unreadCount: number;
  email: string;
}

const ChatList: React.FC = () => {
  const chats: Chat[] = [
    { id: 1, nickname: "곰탱이", lastMessage: "안녕", time: "2:30 PM", imageUrl: "https://picsum.photos/600/400",unreadCount:2 ,email: "test@example.com"},
    { id: 2, nickname: "집순이", lastMessage: "반가워", time: "1:15 PM", imageUrl: "https://picsum.photos/600/400",unreadCount:0, email: "test@example.com"},
    { id: 3, nickname: "알라딘딘", lastMessage: "어디야?", time: "12:00 PM", imageUrl: "https://picsum.photos/600/400",unreadCount:3,email: "test@example.com"}
  ];

  useEffect(() => {
    // 채팅방 목록 조회 api호출 받은 값 중 해당하는 채팅방 클릭시 전달
  }, []);

  return (
    <div className="flex justify-center">
        <div className="grid grid-cols-1 w-full">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          nickname={chat.nickname}
          lastMessage={chat.lastMessage}
          time={chat.time}
          imageUrl={chat.imageUrl}
          unreadCount={chat.unreadCount}
          email={chat.email}
        />
      ))}
          </div>
          </div>
  );
};

export default ChatList;
