import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { receiveMessage, setError, sendMessage } from '../../store/slices/chatSlice';
import { useSendChatMessage } from '../../services/api/chatAPI';
import Loading from '../../components/common/Loading';

const AIChatBot = () => {
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.chat);
  const { mutate: sendChatMessage } = useSendChatMessage();
  const [newMessage, setNewMessage] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      dispatch(sendMessage(newMessage));
      
      sendChatMessage(newMessage, {
        onSuccess: (response) => {
          dispatch(receiveMessage(response));
        },
        onError: (err) => {
          const errorMessage =
            err instanceof Error ? err.message : 'API 통신 관련 문제가 발생했습니다.';
          dispatch(setError(errorMessage));
        }
      });
      
      setNewMessage('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      dispatch(setError(errorMessage));
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* 채팅 헤더 */}
      <div className="p-4 bg-primary-400">
        <h2 className="text-xl font-bold text-white">네이버 클라우드 + TinyLlama 고객센터</h2>
        <p className="text-sm text-violet-100 mt-1 opacity-90">AI 기반 고객 상담 서비스</p>
      </div>

      {/* 메시지 영역 */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm transition-all duration-200 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:shadow-md'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-sm">
              <Loading />
            </div>
          </div>
        )}
      </div>

      {/* 입력 폼 */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-3 text-base rounded-xl border border-gray-200 dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500
                     transition-all duration-200"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary-500 text-white rounded-xl
                     hover:opacity-90 transition-all duration-200 font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading || !newMessage.trim()}
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBot;
