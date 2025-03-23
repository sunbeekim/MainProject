import MessageInput from '../../components/features/chat/MessageInput';
import { useState, useEffect, useMemo } from 'react';
import { useRef } from 'react';
import { useChat } from '../../services/real-time/useChat';
import { Navigate, useParams } from 'react-router-dom';
import { MessageType } from '../../services/real-time/types';
import { ChatRoom as ChatRoomType, getChatRoomDetail } from '../../services/api/userChatAPI';
import { axiosInstance } from '../../services/api/axiosInstance';
import { apiConfig } from '../../services/api/apiConfig';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useUserProfileImage } from '../../services/api/profileImageAPI';

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
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || '';

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

  // 상대방 프로필 이미지 조회
  const { data: profileImage, isLoading: isLoadingProfile } = useUserProfileImage(chatInfo?.otherUserName || '');

  // 프로필 이미지 URL 생성
  const profileImageUrl = useMemo(() => {
    if (profileImage?.status === 'success' && profileImage.data.response) {
      return URL.createObjectURL(profileImage.data.response);
    }
    return 'https://picsum.photos/600/400'; // 기본 이미지
  }, [profileImage]);

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      if (profileImageUrl && profileImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  // 컴포넌트 마운트 시 연결 시도 (한 번만)
  useEffect(() => {
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    if (!isConnected && !isConnecting && chatroomId && connectionAttempts < maxRetries) {
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
      if (!chatroomId || !userEmail) {
        setError('채팅방 정보가 올바르지 않습니다.');
        return;
      }

      try {
        const response = await getChatRoomDetail(Number(chatroomId));
        const chatRoomData = response.data;

        if (chatRoomData.success) {
          // API 응답 데이터를 ChatRoom 타입에 맞게 변환
          setChatInfo({
            chatroomId: Number(chatroomId),
            chatname: chatRoomData.chatname,
            productId: chatRoomData.productId,
            productName: chatRoomData.productName,
            productImageUrl: chatRoomData.productImageUrl,
            registrantEmail: chatRoomData.registrantEmail,
            sellerEmail: chatRoomData.sellerEmail,
            buyerEmail: chatRoomData.buyerEmail,
            otherUserEmail: chatRoomData.otherUserEmail,
            otherUserName: chatRoomData.otherUserName,
            lastMessage: chatRoomData.lastMessage || '',
            lastMessageTime: Array.isArray(chatRoomData.lastMessageTime) 
              ? new Date(
                  chatRoomData.lastMessageTime[0], 
                  chatRoomData.lastMessageTime[1] - 1, 
                  chatRoomData.lastMessageTime[2], 
                  chatRoomData.lastMessageTime[3], 
                  chatRoomData.lastMessageTime[4], 
                  chatRoomData.lastMessageTime[5]
                ).toISOString()
              : new Date().toISOString(),
            status: 'ACTIVE',
            createdAt: Array.isArray(chatRoomData.createdAt)
              ? new Date(
                  chatRoomData.createdAt[0],
                  chatRoomData.createdAt[1] - 1,
                  chatRoomData.createdAt[2],
                  chatRoomData.createdAt[3],
                  chatRoomData.createdAt[4],
                  chatRoomData.createdAt[5]
                ).toISOString()
              : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            unreadCount: 0
          });

          // 상품 등록자가 아닌 경우 함께하기 버튼 숨기기
          if (userEmail !== chatRoomData.registrantEmail) {
            setShow(false);
          }
        } else {
          setError('채팅방 정보를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('채팅방 정보 로딩 오류:', error);
        setError('채팅방 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatRoomInfo();
  }, [chatroomId, userEmail]);

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

  // 메시지 시간 포맷팅 함수 수정
  const formatMessageTime = (dateStr: string | number[]) => {
    try {
      let date: Date;
      
      if (Array.isArray(dateStr)) {
        // 배열 형식의 날짜 처리 [년, 월, 일, 시, 분]
        const [year, month, day, hour, minute] = dateStr;
        // 초는 기본값 0으로 설정
        date = new Date(year, month - 1, day, hour, minute, 0);
      } else {
        // 문자열 형식의 날짜 처리
        date = new Date(dateStr);
      }

      // 날짜가 유효한지 확인
      if (isNaN(date.getTime())) {
        console.error('유효하지 않은 날짜:', dateStr);
        return '시간 정보 없음';
      }

      // 한국 시간으로 표시
      return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '시간 정보 없음';
    }
  };

  // 로딩 상태 표시 부분 수정
  if (isLoading || isConnecting || isLoadingMessages || isLoadingProfile) {
    return (
      <div className="flex flex-col h-full">
        {/* 채팅방 헤더는 항상 표시 */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-gray-800 dark:to-gray-700 
          p-3 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
              <img
                src={profileImageUrl}
                alt="프로필"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://picsum.photos/600/400';
                }}
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
  if (!chatroomId || !userEmail) {
    console.log('채팅방 정보 로드 실패:', error);
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
            // 웹소켓을 통해 메시지가 전달될 것이므로 로컬 상태 업데이트는 제거
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
        // 웹소켓을 통해 메시지가 전달될 것이므로 로컬 상태 업데이트는 제거
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
              src={profileImageUrl}
              alt="프로필"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://picsum.photos/600/400';
              }}
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

        {/* 함께하기 버튼 - 상품 등록자일 경우에만 표시 */}
        {show && chatInfo?.registrantEmail === userEmail && (
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
          className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900 pb-32"
        >
          {[...previousMessages, ...messages].sort((a, b) => {
            // 날짜 비교를 위한 함수
            const getTime = (date: string | number[]) => {
              if (Array.isArray(date)) {
                const [year, month, day, hour, minute] = date;
                return new Date(year, month - 1, day, hour, minute).getTime();
              }
              return new Date(date).getTime();
            };

            // sentAt 기준으로 오름차순 정렬
            return getTime(a.sentAt || '') - getTime(b.sentAt || '');
          }).map((msg, index) => (
            <div key={msg.messageId || index} className="group relative">
              <div className={`flex flex-col ${msg.senderEmail === userEmail ? 'items-end' : 'items-start'}`}>
                {/* 닉네임 표시 */}
                {msg.senderEmail !== userEmail && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-1">
                    {chatInfo?.otherUserName || '알 수 없음'}
                  </span>
                )}
                {/* 메시지와 시간을 감싸는 컨테이너 */}
                <div className="flex items-end gap-2">
                  {/* 시간을 왼쪽에 표시 (내가 보낸 메시지일 경우) */}
                  {msg.senderEmail === userEmail && (
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatMessageTime(msg.sentAt || '')}
                    </span>
                  )}
                  {/* 메시지 내용 */}
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
                  {/* 시간을 오른쪽에 표시 (상대방이 보낸 메시지일 경우) */}
                  {msg.senderEmail !== userEmail && (
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatMessageTime(msg.sentAt || '')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 입력 영역 */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 mb-safe p-4">
          <div className="mx-auto max-w-screen-md">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
