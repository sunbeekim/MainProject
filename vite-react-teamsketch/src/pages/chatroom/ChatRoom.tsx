import MessageInput from '../../components/features/chat/MessageInput';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useChat } from '../../services/real-time/useChat';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { MessageType } from '../../services/real-time/types';
import { ChatRoom as ChatRoomType, getChatRoomDetail } from '../../services/api/userChatAPI';
import { axiosInstance } from '../../services/api/axiosInstance';
import { apiConfig } from '../../services/api/apiConfig';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface LocationState {
  email: string;
  otherUserEmail: string;
  chatroomId: number;
  nickname: string;
  chatname: string;
  imageUrl: string;
}

interface ChatMessage {
  messageId: number;
  chatroomId: number;
  content: string;
  senderEmail: string;
  messageType: MessageType;
  sentAt: string;
  isRead: boolean;
}

const ChatRoom: React.FC = () => {
  const { chatroomId } = useParams();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || '';
  const state = location.state as LocationState;
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState(true);
  const [chatInfo, setChatInfo] = useState<ChatRoomType | null>(null);
  const [previousMessages, setPreviousMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxRetries = 3;

  // useChat 훅 사용
  const { messages, sendMessage, sendImage, isConnected, connect } = useChat({
    chatroomId: Number(chatroomId),
    userEmail,
    useGlobalConnection: false,
    token: token || ''
  });

  // 컴포넌트 마운트 시 연결 시도 (한 번만)
  useEffect(() => {
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    if (!isConnected && !isConnecting && userEmail && chatroomId && connectionAttempts < maxRetries) {
      setIsConnecting(true);
      try {
        connect();
      } catch (error) {
        console.error('채팅 서버 연결 실패:', error);
        setConnectionAttempts(prev => prev + 1);
      } finally {
        setIsConnecting(false);
      }
    }
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 연결 상태 변경 감지
  useEffect(() => {
    if (isConnected) {
      setConnectionAttempts(0);
    }
  }, [isConnected]);

  // 채팅방 정보 로드
  useEffect(() => {
    const loadChatRoomInfo = async () => {
      if (!chatroomId) {
        setError('채팅방 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      if (!userEmail) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // state에서 정보를 가져오거나 API를 호출
        if (state) {
          setChatInfo({
            chatroomId: Number(chatroomId),
            chatname: state.chatname,
            otherUserName: state.nickname,
            productImageUrl: state.imageUrl,
            sellerEmail: state.otherUserEmail,
            buyerEmail: userEmail,
            otherUserEmail: state.otherUserEmail,
            status: 'ACTIVE',
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            productId: 0,
            productName: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          setIsLoading(false);
        } else {
          const chatRoomInfo = await getChatRoomDetail(Number(chatroomId));
          setChatInfo(chatRoomInfo);
        }
        
      } catch (error) {
        console.error('채팅방 정보 로드 실패:', error);
        setError('채팅방 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatRoomInfo();
  }, [chatroomId, userEmail, state]);

  // 이전 메시지 로드
  useEffect(() => {
    const loadPreviousMessages = async () => {
      if (!chatroomId || !token) return;
      
      try {
        setIsLoadingMessages(true);
        const response = await axiosInstance.get(
          `${apiConfig.endpoints.core.base}/chat/rooms/${chatroomId}/messages`
        );
        
        if (response.data?.status === 'success' && response.data?.data?.messages) {
          const messages = response.data.data.messages.map((msg: any) => ({
            messageId: msg.messageId,
            chatroomId: msg.chatroomId,
            content: msg.content,
            senderEmail: msg.senderEmail,
            messageType: msg.messageType || MessageType.TEXT,
            sentAt: msg.sentAt || msg.createdAt,
            isRead: msg.isRead || false
          }));
          setPreviousMessages(messages);
          console.log('이전 메시지 로드 완료:', messages);
        }
      } catch (error) {
        console.error('이전 메시지 로드 실패:', error);
        toast.error('이전 메시지를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadPreviousMessages();
  }, [chatroomId, token]);

  // 메시지 읽음 처리
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!chatroomId || !token) return;

      try {
        await axiosInstance.put(
          `${apiConfig.endpoints.core.base}/chat/rooms/${chatroomId}/messages/read`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('메시지 읽음 처리 완료');
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    };

    if (isConnected) {
      markMessagesAsRead();
    }
  }, [chatroomId, token, isConnected]);

  // 스크롤을 항상 최신 메시지로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, previousMessages]);

  // 연결 상태 및 로딩 상태 표시
  if (isLoading || isConnecting || isLoadingMessages) {
    return (
      <div className="flex flex-col h-full">
        {/* 채팅방 헤더는 항상 표시 */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-gray-800 dark:to-gray-700 
          p-3 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
              <img
                src={chatInfo?.productImageUrl || 'https://picsum.photos/600/400'}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-white">
                {chatInfo?.otherUserName || '상대방'}
              </span>
              <span className="text-sm text-white/70">
                {chatInfo?.chatname || '채팅'}
              </span>
            </div>
          </div>
        </div>

        {/* 로딩 상태에 따른 메시지 표시 */}
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            {isConnecting ? (
              <>
                <p className="text-gray-500 mb-2">채팅 서버에 연결 중...</p>
                <p className="text-xs text-gray-400">잠시만 기다려주세요</p>
              </>
            ) : isLoadingMessages ? (
              <>
                <p className="text-gray-500 mb-2">이전 메시지를 불러오는 중...</p>
                <p className="text-xs text-gray-400">잠시만 기다려주세요</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-2">채팅방 정보를 불러오는 중...</p>
                <p className="text-xs text-gray-400">잠시만 기다려주세요</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 에러가 있거나 필수 정보가 없을 때
  if (error || !chatroomId || !userEmail) {
    return <Navigate to="/chat-list" replace />;
  }

  // 함께하기 버튼 클릭 핸들러
  const handleJoinClick = async () => {
    if (!chatroomId) return;

    try {
      const response = await axiosInstance.post(
        `${apiConfig.endpoints.core.base}/chat/rooms/${chatroomId}/approve`
      );
      
      if (response.data?.status === 'success') {
        setShow(false);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error('함께하기 요청 실패:', error);
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = async (
    message: string,
    file?: { type: string; url: string; name?: string }
  ) => {
    if (!message.trim() && !file) return;
    
    if (!isConnected) {
      toast.error('채팅 서버에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.');
      // 연결 재시도
      if (connectionAttempts < maxRetries) {
        setIsConnecting(true);
        try {
          await connect();
          // 연결 성공 후 메시지 재전송
          handleSendMessage(message, file);
        } catch (error) {
          console.error('재연결 실패:', error);
          toast.error('서버 연결에 실패했습니다.');
        } finally {
          setIsConnecting(false);
        }
      }
      return;
    }

    if (!token) {
      setError('인증 토큰이 만료되었습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      if (file) {
        if (file.type === 'image') {
          // 이미지 메시지 전송
          const formData = new FormData();
          formData.append('chatroomId', chatroomId);
          formData.append('image', file.url);

          const response = await axiosInstance.post(
            `${apiConfig.endpoints.core.base}/chat/messages/image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (response.data?.status === 'success') {
            sendImage(file.url);
          }
        } else {
          // 파일 메시지 전송
          sendMessage(JSON.stringify({
            type: file.type,
            url: file.url,
            name: file.name
          }), MessageType.FILE);
        }
      } else {
        // 텍스트 메시지 전송
        sendMessage(message.trim(), MessageType.TEXT);
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* 채팅 상대방 정보 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-gray-800 dark:to-gray-700 
        p-3 flex items-center justify-between shadow-md z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
            <img
              src={chatInfo?.productImageUrl || 'https://picsum.photos/600/400'}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-white">
              {chatInfo?.otherUserName || '상대방'}
            </span>
            <span className="text-sm text-white/70">
              {chatInfo?.chatname || '채팅'}
            </span>
          </div>
        </div>

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

      {/* 메시지와 입력 영역을 감싸는 컨테이너 */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* 채팅 메시지 영역 */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900 pb-20"
        >
          {[...previousMessages, ...messages].map((msg, index) => (
            <div key={msg.messageId || index} className="group relative">
              <div className={`flex flex-col ${msg.senderEmail === userEmail ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 shadow-md ${
                  msg.senderEmail === userEmail 
                    ? 'bg-primary-500 text-white rounded-tr-sm' 
                    : 'bg-white rounded-tl-sm'
                }`}>
                  {msg.messageType === MessageType.IMAGE ? (
                    <img
                      src={msg.content}
                      alt="전송된 이미지"
                      className="w-full max-w-xs rounded-xl"
                    />
                  ) : msg.messageType === MessageType.FILE ? (
                    <a
                      href={msg.content}
                      download
                      className="block p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                    >
                      📄 첨부파일
                    </a>
                  ) : (
                    <p className={msg.senderEmail === userEmail ? 'text-white' : 'text-gray-800'}>
                      {msg.content}
                    </p>
                  )}
                </div>

                {/* 메시지 전송 시간 표시 */}
                <div className="text-xs text-gray-500 mt-1">
                  {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) : '시간 정보 없음'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 입력 영역 */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 mb-safe">
          <div className="mx-auto max-w-screen-md mb-4">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
