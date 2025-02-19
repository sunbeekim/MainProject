import { useState } from 'react';
import { DeepSeekNaverChat } from '../../services/api/chatAPI';
import Chat from '../../components/features/chat/Chat';
import { IChatMessage } from '../../components/features/chat/types';

const AIChatBot = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const handleSendMessage = async (message: string): Promise<void> => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsChatLoading(true);

    try {
      const data = await DeepSeekNaverChat(message);
      // 응답이 문자열인 경우도 처리1
      const responseContent = typeof data === 'string' ? data : data.response;
      console.log(responseContent);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseContent 
      }]);
    } catch (error) {
      console.error('채팅 에러:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '죄송합니다. 오류가 발생했습니다.' 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Chat
        title="네이버 클라우드 + TinyLlama 고객센터"
        subtitle="AI 기반 고객 상담 서비스"
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
    </div>
  );
};

export default AIChatBot;