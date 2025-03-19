import { store } from '../../store/store';
import { setYourLocation } from '../../store/slices/mapSlice';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import WebSocketManager from './websocket';

class RedisSubscriber {
  private static instance: RedisSubscriber;
  private stompClient: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private subscriptions: Map<string, ((data: any) => void)[]> = new Map();
  private isConnecting = false;

  private constructor() {
    this.connect();
  }

  public static getInstance(): RedisSubscriber {
    if (!RedisSubscriber.instance) {
      RedisSubscriber.instance = new RedisSubscriber();
    }
    return RedisSubscriber.instance;
  }

  private connect() {
    if (this.isConnecting) return;
    
    this.isConnecting = true;
    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080';
      console.log('Redis WebSocket 연결 시도:', wsUrl);
      
      const socket = new SockJS(`${wsUrl}/ws/redis`, null, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        timeout: 10000,
        sessionId: () => {
          return Math.random().toString(36).substring(2, 15);
        }
      });
      
      console.log('SockJS 연결 시도:', {
        url: `${wsUrl}/ws/redis`,
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        timeout: 10000
      });
      
      this.stompClient = Stomp.over(() => socket);

      const connectOptions = {
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          'heart-beat': '4000,4000'
        },
        debug: (str: string) => {
          console.log('STOMP Debug:', str);
        }
      };

      console.log('STOMP 연결 옵션:', connectOptions);

      this.stompClient.connect(connectOptions, 
        () => {
          console.log('Redis WebSocket 연결 성공');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.resubscribeAll();
          
          // 연결 상태 모니터링
          setInterval(() => {
            if (this.stompClient && this.stompClient.connected) {
              console.log('STOMP 연결 상태: 연결됨');
            } else {
              console.log('STOMP 연결 상태: 연결 끊김');
              this.handleReconnect();
            }
          }, 5000);
        },
        (error: any) => {
          console.error('Redis WebSocket 연결 실패:', error);
          console.error('연결 실패 상세:', {
            message: error?.message || '알 수 없는 오류',
            stack: error?.stack || '스택 트레이스 없음',
            type: error?.type || '타입 없음'
          });
          this.isConnecting = false;
          this.handleReconnect();
        }
      );

      socket.onclose = (event) => {
        console.log('Redis WebSocket 연결 종료:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        this.isConnecting = false;
        this.handleReconnect();
      };

    } catch (error) {
      console.error('Redis WebSocket 연결 실패:', error);
      console.error('연결 실패 상세:', {
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : '스택 트레이스 없음',
        type: error instanceof Error ? error.name : '타입 없음'
      });
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private resubscribeAll() {
    // 기존 구독 복구
    this.subscriptions.forEach((handlers, channel) => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.subscribe(`/redis/${channel}`, (message: any) => {
          try {
            const data = JSON.parse(message.body);
            handlers.forEach(handler => handler(data));
          } catch (error) {
            console.error('메시지 파싱 오류:', error);
          }
        });
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Redis 최대 재연결 시도 횟수 초과');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Redis 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    // 지수 백오프 적용
    const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
    setTimeout(() => this.connect(), timeout);
  }

  public subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
    }
    this.subscriptions.get(channel)?.push(callback);

    // 구독 메시지 전송
    if (this.stompClient?.connected) {
      this.stompClient.subscribe(`/redis/${channel}`, (message: any) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      });
    }

    // 구독 해제 함수 반환
    return () => {
      const handlers = this.subscriptions.get(channel);
      if (handlers) {
        const index = handlers.indexOf(callback);
        if (index > -1) {
          handlers.splice(index, 1);
        }
        if (handlers.length === 0) {
          this.subscriptions.delete(channel);
          // 구독 해제 메시지 전송
          if (this.stompClient?.connected) {
            this.stompClient.unsubscribe(`/redis/${channel}`);
          }
        }
      }
    };
  }

  public unsubscribe(channel: string) {
    this.subscriptions.delete(channel);
    if (this.stompClient?.connected) {
      this.stompClient.unsubscribe(`/redis/${channel}`);
    }
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    this.subscriptions.clear();
  }
}

// 위치 업데이트 구독 예시
export const subscribeToLocationUpdates = (chatRoomId: string) => {
  const subscriber = RedisSubscriber.getInstance();
  
  return subscriber.subscribe(`location:${chatRoomId}`, (data) => {
    if (data && data.lat && data.lng) {
      store.dispatch(setYourLocation({
        lat: data.lat,
        lng: data.lng,
        address: data.address || '위치 정보 없음',
        meetingPlace: data.meetingPlace || '위치 정보 없음'
      }));
    }
  });
};

// 채팅 메시지 구독 예시
export const subscribeToChatMessages = (chatRoomId: string, callback: (message: any) => void) => {
  const subscriber = RedisSubscriber.getInstance();
  return subscriber.subscribe(`chat:${chatRoomId}`, callback);
};

// 알림 구독 예시
export const subscribeToNotifications = (userId: string, callback: (notification: any) => void) => {
  const subscriber = RedisSubscriber.getInstance();
  return subscriber.subscribe(`notification:${userId}`, callback);
};

// 상품 신청 알림 구독
export const subscribeToProductRequests = (sellerId: string, callback: (request: any) => void) => {
  const subscriber = RedisSubscriber.getInstance();
  return subscriber.subscribe(`product_request:${sellerId}`, callback);
};

// 상품 신청 알림 전송
export const sendProductRequestNotification = (sellerId: string, requestData: {
  productId: number;
  productTitle: string;
  requesterId: string;
  requesterName: string;
  requestTime: string;
}) => {
  const ws = WebSocketManager.getInstance();
  ws.sendMessage('product_request', {
    sellerId,
    ...requestData
  });
};

// 상품 신청 승인 알림 구독
export const subscribeToRequestApprovals = (requesterId: string, callback: (approval: any) => void) => {
  const subscriber = RedisSubscriber.getInstance();
  return subscriber.subscribe(`request_approval:${requesterId}`, callback);
};

// 상품 신청 승인 알림 전송
export const sendRequestApprovalNotification = (requesterId: string, approvalData: {
  productId: number;
  productTitle: string;
  sellerId: string;
  sellerName: string;
  approvalTime: string;
}) => {
  const ws = WebSocketManager.getInstance();
  ws.sendMessage('request_approval', {
    requesterId,
    ...approvalData
  });
};

export default RedisSubscriber;
