import { Client } from '@stomp/stompjs';
import { IChatMessage, INotification, MessageType } from './types';
import { apiConfig } from '../api/apiConfig';

interface LocationUpdate {
  chatroomId: number;
  email: string;
  lat: number;
  lng: number;
  address?: string;
  timestamp?: string;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, { 
    id: string; 
    callback: (data: IChatMessage | INotification | LocationUpdate) => void 
  }> = new Map();
  private reconnectTimeout: number = 3000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  connect(token: string | undefined) {
    if (this.client?.connected) {
      console.log('이미 웹소켓에 연결되어 있습니다.');
      return;
    }

    this.client = new Client({
      brokerURL: apiConfig.endpoints.core.websocket,
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : ''
      },
    //   debug: function (str) {
    //     console.log('STOMP: ' + str);
    //   },
      reconnectDelay: this.reconnectTimeout,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = () => {
      //console.log('웹소켓 연결 성공');
      this.reconnectAttempts = 0;
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP 에러:', frame);
      this.handleReconnect();
    };

    this.client.onWebSocketError = (event) => {
      console.error('웹소켓 에러:', event);
      this.handleReconnect();
    };

    try {
      this.client.activate();
    } catch (error) {
      console.error('웹소켓 연결 활성화 중 오류:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      //console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => this.client?.activate(), this.reconnectTimeout);
    } else {
      console.error('최대 재연결 시도 횟수 초과');
    }
  }

  disconnect() {
    if (this.client?.connected) {
      this.client.deactivate();
      //console.log('웹소켓 연결 해제');
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }

  // 채팅방 구독
  subscribeToChatRoom(chatroomId: number, callback: (message: IChatMessage) => void): string {
    if (!this.client?.connected) {
      console.error('웹소켓이 연결되어 있지 않습니다.');
      return '';
    }

    const subscriptionId = `chat_${chatroomId}`;
    
    if (!this.subscriptions.has(subscriptionId)) {
      const subscription = this.client.subscribe(
        `/topic/room.${chatroomId}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body) as IChatMessage;
          callback(parsedMessage);
        }
      );

      this.subscriptions.set(subscriptionId, {
        id: subscription.id,
        callback: callback as (data: IChatMessage | INotification | LocationUpdate) => void
      });
    }

    return subscriptionId;
  }

  // 사용자 알림 구독
  subscribeToUserNotifications(
    userEmail: string,
    callback: (notification: INotification) => void
  ): string {
    if (!this.client?.connected) {
      console.error('웹소켓이 연결되어 있지 않습니다.');
      return '';
    }

    const subscriptionId = `notification_${userEmail}`;
    
    if (!this.subscriptions.has(subscriptionId)) {
      const subscription = this.client.subscribe(
        `/topic/notification.${userEmail}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body) as INotification;
          callback(parsedMessage);
        }
      );

      this.subscriptions.set(subscriptionId, {
        id: subscription.id,
        callback: callback as (data: IChatMessage | INotification | LocationUpdate) => void
      });
    }

    return subscriptionId;
  }

  // 위치 공유 구독
  subscribeToLocationUpdates(
    chatroomId: number,
    callback: (location: LocationUpdate) => void
  ): string {
    if (!this.client?.connected) {
      console.error('웹소켓이 연결되어 있지 않습니다.');
      return '';
    }

    const destination = `/topic/location.${chatroomId}`;
    const subscriptionKey = `location_${chatroomId}`;

    const subscription = this.client.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body) as LocationUpdate;
      callback(parsedMessage);
    });

    this.subscriptions.set(subscriptionKey, {
      id: subscription.id,
      callback: callback as (data: IChatMessage | INotification | LocationUpdate) => void
    });

    //console.log(`위치 업데이트 구독 시작: ${destination}`);
    return subscriptionKey;
  }

  // 위치 정보 전송
  sendLocationUpdate(chatroomId: number, email: string, lat: number, lng: number): void {
    if (!this.client?.connected) {
      console.error('웹소켓이 연결되어 있지 않습니다.');
      return;
    }

    const destination = `/app/location/${chatroomId}`;
    const message: LocationUpdate = {
      chatroomId,
      email,
      lat,
      lng,
      timestamp: new Date().toISOString()
    };

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(message)
      });
      //console.log(`위치 정보 전송 완료: ${destination}`);
    } catch (error) {
      console.error('위치 정보 전송 실패:', error);
    }
  }

  // 채팅 메시지 전송
  sendChatMessage(message: {
    chatroomId: number;
    content: string;
    messageType: MessageType;
    senderEmail: string;
  }) {
    if (!this.client?.connected) {
      console.error('웹소켓이 연결되어 있지 않습니다.');
      return;
    }

    this.client.publish({
      destination: '/app/chat/send',
      body: JSON.stringify(message)
    });
  }

  unsubscribe(subscriptionId: string) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (subscription) {
        // 클라이언트가 연결되어 있을 때만 구독 해제 시도
        if (this.client?.connected) {
          this.client.unsubscribe(subscription.id);
        }
        this.subscriptions.delete(subscriptionId);
      }
    } catch (error) {
      console.warn('구독 해제 중 오류 발생:', error);
    }
  }
}

export const websocketService = new WebSocketService();