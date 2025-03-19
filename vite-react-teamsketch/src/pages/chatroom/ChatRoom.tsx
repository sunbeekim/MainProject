import MessageInput from '../../components/features/chat/MessageInput';
import { useState } from 'react';
import { useRef, useEffect } from 'react';

interface ChatRoomProps {
  nickname?: string;
  imageUrl?: string;
}

interface Message {
  text?: string;
  file?: { type: string; url: string; name?: string };
  timestamp: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ nickname, imageUrl }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState(true);

  // 개별상품 조회를 통해 email 받아와서 함께하기 버튼 렌더링 여부 판단 api호출

  const handleJoinClick = () => {
    if (show) {
      // 상품승인 api호출
      console.log('함께하기 버튼 클릭됨');
      setShow(false);
      setIsDisabled(true);
    }
  };

  const handleSendMessage = (
    message: string,
    file?: { type: string; url: string; name?: string }
  ) => {
    if (!message.trim() && !file) return;
    const currentTimestamp = new Date().toLocaleString();
    const newMessage: Message = {
      text: message || undefined,
      file: file || undefined,
      timestamp: currentTimestamp
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleMessageDelete = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isDisabled]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* 채팅 상대방 정보 */}
      <div
        className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-gray-800 dark:to-gray-700 
        p-3 flex items-center justify-between shadow-md z-10"
      >
        {/* 프로필 정보 */}
        <div className="flex items-center space-x-3">
          {/* 프로필 이미지 */}
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
            <img
              src={imageUrl || 'https://picsum.photos/600/400'}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 닉네임 */}
          <span className="text-base font-medium text-white dark:text-white">
            {nickname || '상대방닉네임'}
          </span>
        </div>

        {/* 함께하기 버튼 (조건부 렌더링) */}
        {show && (
          <button
            onClick={handleJoinClick}
            disabled={isDisabled}
            className="
              bg-white text-primary-600 dark:bg-gray-700 dark:text-white
              px-4 py-2 rounded-full shadow-md hover:shadow-lg
              transition-all duration-300 hover:bg-primary-100 dark:hover:bg-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium
            "
          >
            함께하기
          </button>
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((msg, index) => (
          <div key={index} className="group relative">
            <div className="flex flex-col items-end">
              {msg.file ? (
                <div className="max-w-[80%] bg-primary-500 rounded-2xl rounded-tr-sm p-1 shadow-md">
                  {msg.file.type === 'image' ? (
                    <img
                      src={msg.file.url}
                      alt="전송된 이미지"
                      className="w-full max-w-xs rounded-xl"
                    />
                  ) : msg.file.type === 'video' ? (
                    <video controls className="w-full max-w-xs rounded-xl">
                      <source src={msg.file.url} type="video/mp4" />
                    </video>
                  ) : (
                    <a
                      href={msg.file.url}
                      download={msg.file.name}
                      className="block p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                    >
                      📄 {msg.file.name}
                    </a>
                  )}
                </div>
              ) : (
                <div className="bg-white p-3 rounded-lg shadow-md w-max">{msg.text}</div>
              )}

              {/* 메시지 전송 시간 표시 */}
              <div className="text-xs text-gray-500 mt-2">{msg.timestamp}</div>

              {/* 메시지 삭제 버튼 */}
              <button
                onClick={() => handleMessageDelete(index)}
                className="text-gray-400 hover:text-secondary-dark hover:bg-transparent bg-transparent py-0 px-0.5 text-xs"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 입력 영역 */}
      <div className="relative bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;
