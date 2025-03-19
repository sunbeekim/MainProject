import React, { useEffect, useState } from 'react';
import { useChat } from '../../../services/real-time/useChat';

// 채팅방 웹소켓 참고용
interface ChatMessage {
  messageId: number;
  chatroomId: number;
  senderEmail: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatRoomProps {
  chatroomId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatroomId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { subscribe, unsubscribe, sendMessage, isConnected } = useChat();

  useEffect(() => {
    // 채팅방 구독
    subscribe(chatroomId, (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe(chatroomId);
    };
  }, [chatroomId, subscribe, unsubscribe]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    const message = {
      chatroomId,
      content: newMessage,
      createdAt: new Date().toISOString()
    };

    sendMessage(chatroomId, message);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${
              message.senderEmail === localStorage.getItem('userEmail')
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderEmail === localStorage.getItem('userEmail')
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom; 