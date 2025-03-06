import { useState, useRef, useEffect } from 'react';
import Loading from '../../common/Loading';

interface ChatProps {
  title: string;
  subtitle: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const Chat: React.FC<ChatProps> = ({ title, subtitle, messages, onSendMessage, isLoading }) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage); // API 호출
      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  return (
    <div className=" flex flex-col h-full w-full bg-background-light dark:bg-background-dark rounded-lg shadow-lg">
      {/* 채팅 헤더 */}
      <div className="p-2 sm:p-4 bg-primary-light dark:bg-primary-dark text-white">
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-200">{subtitle}</p>}
      </div>

      {/* 메시지 영역 */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } mb-2 sm:mb-4`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-2 sm:p-3 ${
                message.role === 'user'
                  ? 'bg-primary-light text-white dark:bg-primary-dark'
                  : 'bg-white dark:bg-gray-700 shadow-md'
              }`}
            >
              <p className="break-words text-sm sm:text-base">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-2 sm:mb-4">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-1 sm:p-2 shadow-md">
              <Loading />
            </div>
          </div>
        )}
      </div>

      {/* 입력 폼 */}
      <div className="p-2 sm:p-4 border-t border-border-light dark:border-border-dark">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !newMessage.trim()}
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
