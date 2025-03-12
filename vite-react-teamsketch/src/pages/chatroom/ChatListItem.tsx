import React from "react";
import { useNavigate } from 'react-router-dom';

interface ChatListItemProps {
  nickname: string;
  lastMessage: string;
  time: string;
  imageUrl: string;
  unreadCount: number;
  email: string; 
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  nickname,
  lastMessage,
  time,
  imageUrl,
  unreadCount,
  email
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${email}`); 
  };

  return (
    <div 
      onClick={handleClick}
      className="
        w-full bg-white dark:bg-gray-800 
        rounded-xl 
        shadow-sm hover:shadow-md
        transition-all duration-300
        p-3 mb-2
        flex items-center gap-3
        cursor-pointer
        border border-gray-100 dark:border-gray-700
        hover:border-primary-200 dark:hover:border-primary-700
      "
    >
      {/* 프로필 이미지 */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-100 dark:ring-primary-900">
          <img 
            src={imageUrl || "https://picsum.photos/600/400"} 
            alt="프로필" 
            className="w-full h-full object-cover"
          />
        </div>
        {unreadCount > 0 && (
          <div className="
            absolute -top-1 -right-1
            bg-primary-500 text-white 
            rounded-full w-5 h-5 
            flex items-center justify-center 
            text-xs font-medium
            ring-2 ring-white dark:ring-gray-800
          ">
            {unreadCount}
          </div>
        )}
      </div>

      {/* 채팅 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="font-medium text-gray-900 dark:text-white truncate">
            {nickname}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {time}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {lastMessage}
        </p>
      </div>

      {/* 채팅방 입장 버튼 */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="
          shrink-0
          bg-gradient-to-r from-primary-500 to-primary-600
          dark:from-primary-600 dark:to-primary-700
          text-white 
          px-4 py-2 
          rounded-full
          text-sm 
          font-medium
          hover:from-primary-600 hover:to-primary-700
          dark:hover:from-primary-500 dark:hover:to-primary-600
          transition-all 
          duration-300
          shadow-sm 
          hover:shadow
          flex items-center gap-1
        "
      >
        <span>채팅</span>
      </button>
    </div>
  );
};

export default ChatListItem;
