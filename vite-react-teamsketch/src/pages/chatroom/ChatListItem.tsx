import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatListItemProps {
  nickname: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  email: string;
  productImage: React.ReactNode;
  chatname: string;
  chatroomId: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  nickname,
  lastMessage,
  time,
  unreadCount,
  email,
  productImage,
  chatname,
  chatroomId
}) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email;

  const handleClick = () => {
    if (!userEmail) {
      console.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    navigate(`/chat/${chatroomId}/${chatname}`, {
      state: {
        email: userEmail,
        otherUserEmail: email,
        chatroomId,
        nickname,
        chatname,
        imageUrl: (productImage as any)?.props?.imagePath || 'https://picsum.photos/600/400'
      }
    });
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
          {productImage}
        </div>
        {unreadCount > 0 && (
          <div
            className="
            absolute -top-1 -right-1
            bg-primary-500 text-white 
            rounded-full w-5 h-5 
            flex items-center justify-center 
            text-xs font-medium
            ring-2 ring-white dark:ring-gray-800
          "
          >
            {unreadCount}
          </div>
        )}
      </div>

      {/* 채팅 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white truncate">{nickname}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{chatname}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {time}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{lastMessage}</p>
      </div>
    </div>
  );
};

export default ChatListItem;
