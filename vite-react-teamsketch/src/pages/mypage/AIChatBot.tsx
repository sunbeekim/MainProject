import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { receiveMessage, setError, sendMessage } from '../../store/slices/chatSlice';
import { useSendChatMessage } from '../../services/api/chatAPI';
import Chat from '../../components/features/chat/Chat';
import { useState } from 'react';

const AIChatBot = () => {
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.chat);
  const { mutate: sendChatMessage } = useSendChatMessage();
  const [error, setLocalError] = useState<string | null>(null);

  const handleSendMessage = async (message: string): Promise<void> => {
    if (!message.trim()) return;
    try {
      setLocalError(null);
      dispatch(sendMessage(message)); // Show user message immediately

      sendChatMessage(message, {
        onSuccess: (response) => {
          dispatch(receiveMessage(response));
        },
        onError: (err) => {
          const errorMessage =
            err instanceof Error ? err.message : 'API 통신 관련 문제가 발생했습니다.';
          setLocalError(errorMessage);
          dispatch(setError(errorMessage));
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    }
  };
  // 채팅 시 footer 가 같이 올라오는 현상이니까 stick
  return (
    <div className="h-full">
      <Chat
        title="네이버 클라우드 + TinyLlama 고객센터"
        subtitle="AI 기반 고객 상담 서비스"
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
      {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
    </div>
  );
};

export default AIChatBot;
