import { useState } from 'react';
import { DeepSeekNaverChat } from '../../services/api/chatAPI';
import Chat from '../../components/features/chat/Chat';
import { IChatMessage } from '../../components/features/chat/types';
import { testAPI } from '../../services/api/testAPI';
const AIChatBot = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testResponse2, setTestResponse2] = useState<any>(null);
  const [testResponse3, setTestResponse3] = useState<any>(null);

  const handleSendMessage = async (message: string): Promise<void> => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsChatLoading(true);

    try {
      const data = await DeepSeekNaverChat(message);
      // 응답이 문자열인 경우도 처리
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

  const handleSendtest = async () => {
    const response = await testAPI.getHello();
    console.log(response);
    setTestResponse(response);
  };

  const handleSendtest2 = async () => {
    const response = await testAPI.postEcho({ message: '안녕하세요' });
    console.log(response);
    setTestResponse2(response);
  };

  const handleSendtest3 = async () => {
    const response = await testAPI.getHealth();
    console.log(response);
    setTestResponse3(response);
  };
  //
  return (
    <div className="container mx-auto px-4 py-8">
      <Chat
        title="네이버 클라우드 + TinyLlama 고객센터"
        subtitle="AI 기반 고객 상담 서비스"
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
      <button onClick={handleSendtest}>
        hello endpoint 호출
      </button>
      <button onClick={handleSendtest2}>
        echo endpoint 호출
      </button>
      <button onClick={handleSendtest3}>
        health endpoint 호출
      </button>
      <div>
        {testResponse && (
          <div>
            <h3>Hello Endpoint Response:</h3>
            <pre>{JSON.stringify(testResponse, null, 2)}</pre>
          </div>
        )}
      </div>
      <div>
        {testResponse2 && (
          <div>
            <h3>Echo Endpoint Response:</h3>
            <pre>{JSON.stringify(testResponse2, null, 2)}</pre>
          </div>
        )}
      </div>
      <div>
        {testResponse3 && ( 
          <div>
            <h3>Health Endpoint Response:</h3>
            <pre>{JSON.stringify(testResponse3, null, 2)}</pre>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AIChatBot;