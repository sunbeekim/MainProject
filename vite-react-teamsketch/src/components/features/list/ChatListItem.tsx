import React from "react";
import { useNavigate } from 'react-router-dom';


interface ChatListItemProps {
  nickname: string;
  lastMessage: string;
  time: string;
  imageUrl: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({nickname, lastMessage, time, imageUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${nickname}`); 
  };

  return (
    
    <div className="w-[500px] h-[100px] bg-white rounded-2xl shadow-lg flex items-center p-4 gap-4">
      {/* 프로필 이미지 */}
      <div className="w-[50px] h-[50px] bg-gray-200 rounded-full overflow-hidden">
        <img src={imageUrl || "https://picsum.photos/600/400"} alt="프로필 이미지" className="w-full h-full object-cover" />
      </div>
  
      <div className="flex flex-col flex-1 w-full">
        {/* 닉네임 */}
        <span className="font-semibold text-lg">{nickname}</span>
        {/* 마지막 메시지 */}
        <h3 className="text-xm text-gray-400 ">{lastMessage}</h3>
        {/* 시간 */}
        <p className="text-gray-500 text-xs">{time}</p>
      </div>
        
      {/* 채팅방 이동 버튼 */}
      <button 
        className="bg-[#FBCCC5] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#F9B0BA] transition-colors"
        onClick={handleClick}
      >
        채팅방
      </button>
      </div>

  );
};

export default ChatListItem;
