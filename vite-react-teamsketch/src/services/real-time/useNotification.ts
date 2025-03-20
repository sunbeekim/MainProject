import { useState, useEffect, useCallback } from 'react';
import { websocketService } from './websocketService';
import { INotification } from './types';

export interface NotificationHookProps {
  userEmail?: string;
  token?: string;
}

export interface NotificationHookReturn {
  notifications: INotification[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  clearNotifications: () => void;
}

/**
 * 실시간 알림 기능을 위한 React Hook
 * @param props 알림 설정에 필요한 속성들
 * @returns 알림 관련 상태와 기능
 */
export const useNotification = ({
  userEmail,
  token
}: NotificationHookProps): NotificationHookReturn => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 웹소켓 연결
  const connect = useCallback(() => {
    if (!userEmail) {
      console.error('사용자 이메일이 제공되지 않았습니다.');
      return;
    }

    try {
      websocketService.connect(token);
      setIsConnected(websocketService.isConnected());
    } catch (error) {
      console.error('웹소켓 연결 오류:', error);
    }
  }, [userEmail, token]);

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
  }, []);

  // 알림 초기화
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // 사용자 알림 구독
  useEffect(() => {
    if (!userEmail || !isConnected) return;

    const subscriptionId = websocketService.subscribeToUserNotifications(
      userEmail,
      (notification) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            ...notification,
            timestamp: notification.timestamp || new Date().toISOString()
          }
        ]);
      }
    );

    return () => {
      if (subscriptionId) {
        websocketService.unsubscribe(subscriptionId);
      }
    };
  }, [userEmail, isConnected]);

  // 컴포넌트 마운트 시 한 번 연결
  useEffect(() => {
    if (userEmail && token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, userEmail, token]);

  return {
    notifications,
    isConnected,
    connect,
    disconnect,
    clearNotifications
  };
}; 