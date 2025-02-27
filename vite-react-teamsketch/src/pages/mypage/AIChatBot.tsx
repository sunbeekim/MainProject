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
  //  음 잘 되는 거같은데 여기도 적어져요?네 굳
  // 이거 TABNIE 자동완성 AI 도 적용 돼요? 왼쪽에 라이브쉐어 누르시면 몇개 안뜨는데 밑에 SESSION CHAT 눌러보세요
  const handleSendMessage = async (message: string): Promise<void> => {
    if (!message.trim()) return;
    //음 날씨 API 호출하는거랑 비슷한데요?네 비슷합니다.
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

  return (
    <div className="container mx-auto h-[calc(100vh-theme(spacing.16))] px-4 py-8">
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
