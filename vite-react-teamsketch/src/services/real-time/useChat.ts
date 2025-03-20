import { useState, useEffect, useCallback } from 'react';
import { websocketService } from './websocketService';
import { IChatMessage, MessageType } from './types';
import { useWebSocket } from '../../contexts/WebSocketContext';

export interface ChatHookProps {
  chatroomId?: number;
  userEmail?: string;
  useGlobalConnection?: boolean; // 전역 웹소켓 연결 사용 여부
  token?: string; // 독립 연결시 사용할 토큰
}

export interface ChatHookReturn {
  messages: IChatMessage[];
  sendMessage: (content: string, messageType?: MessageType) => void;
  sendImage: (imageUrl: string) => void;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

/**
 * 채팅 기능을 위한 React Hook
 * @param props 채팅에 필요한 설정
 * @returns 채팅 관련 상태와 기능
 */
export const useChat = ({ 
  chatroomId, 
  userEmail, 
  useGlobalConnection = true, 
  token 
}: ChatHookProps): ChatHookReturn => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  
  // 전역 웹소켓 연결 항상 가져오기 (React Hook 규칙)
  const globalWebSocket = useWebSocket();
  const [localConnected, setLocalConnected] = useState<boolean>(false);
  
  // 전역 연결 또는 로컬 연결 상태 확인
  const isConnected = useGlobalConnection 
    ? globalWebSocket.isConnected
    : localConnected;

  // 웹소켓 연결
  const connect = useCallback(() => {
    if (!userEmail) {
      console.error('사용자 이메일이 제공되지 않았습니다.');
      return;
    }

    try {
      if (useGlobalConnection) {
        // 전역 웹소켓 연결 사용
        globalWebSocket.connect(token);
      } else {
        // 독립 웹소켓 연결 사용
        websocketService.connect(token);
        setLocalConnected(websocketService.isConnected());
      }
    } catch (error) {
      console.error('웹소켓 연결 오류:', error);
    }
  }, [userEmail, token, useGlobalConnection, globalWebSocket]);

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    if (useGlobalConnection) {
      // 전역 웹소켓은 필요할 때만 연결 해제
      // 대부분의 경우 앱 종료 시까지 연결 유지
    } else {
      // 독립 웹소켓 연결 해제
      websocketService.disconnect();
      setLocalConnected(false);
    }
  }, [useGlobalConnection, globalWebSocket]);

  // 채팅방 구독
  useEffect(() => {
    if (!chatroomId || !userEmail || !isConnected) return;

    const subscriptionId = websocketService.subscribeToChatRoom(chatroomId, (message) => {
      setMessages((prevMessages) => {
        // 중복 메시지 방지
        const isDuplicate = prevMessages.some(
          (m) => m.messageId === message.messageId
        );
        if (isDuplicate) return prevMessages;
        return [...prevMessages, message];
      });
    });

    return () => {
      if (subscriptionId) {
        websocketService.unsubscribe(subscriptionId);
      }
    };
  }, [chatroomId, userEmail, isConnected]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string, messageType: MessageType = MessageType.TEXT) => {
      if (!chatroomId || !userEmail || !isConnected) {
        console.error('메시지를 보낼 수 없습니다. 연결 상태와 필수 정보를 확인하세요.');
        return;
      }

      try {
        websocketService.sendChatMessage({
          chatroomId,
          senderEmail: userEmail,
          content,
          messageType
        });
      } catch (error) {
        console.error('메시지 전송 오류:', error);
      }
    },
    [chatroomId, userEmail, isConnected]
  );

  // 이미지 전송
  const sendImage = useCallback(
    (imageUrl: string) => {
      sendMessage(imageUrl, MessageType.IMAGE);
    },
    [sendMessage]
  );

  // 컴포넌트 마운트 시 한 번 연결 (독립 연결 모드일 때만)
  useEffect(() => {
    if (!useGlobalConnection && userEmail && token) {
      connect();
    }

    return () => {
      if (!useGlobalConnection) {
        disconnect();
      }
    };
  }, [connect, disconnect, userEmail, token, useGlobalConnection]);

  return {
    messages,
    sendMessage,
    sendImage,
    isConnected,
    connect,
    disconnect,
  };
}; 