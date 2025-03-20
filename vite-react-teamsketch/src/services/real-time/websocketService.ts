import { Client, IMessage, StompSubscription, IFrame } from '@stomp/stompjs';
import { WebSocketConfig, IChatMessage, INotification } from './types';

// 싱글톤 인스턴스
let stompClient: Client | null = null;
const subscriptions: Map<string, StompSubscription> = new Map();

// 환경 변수에서 백엔드 URL 가져오기 (기본값은 localhost:8080)
const BACKEND_URL = 'ws://localhost:8080/ws';

/**
 * WebSocket 연결 설정 및 관리를 위한 서비스
 */
export const websocketService = {
  /**
   * WebSocket 연결 초기화 및 설정
   * @param token JWT 토큰
   * @param config WebSocket 추가 설정
   * @returns WebSocket 클라이언트 인스턴스
   */
  connect: (token?: string, config?: Partial<WebSocketConfig>): Client => {
    if (stompClient && stompClient.connected) {
      console.log('WebSocket 이미 연결됨');
      return stompClient;
    }

    // 기본 설정
    const defaultConfig: WebSocketConfig = {
      brokerURL: BACKEND_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: false
    };

    // 사용자 설정과 기본 설정 병합
    const finalConfig = { ...defaultConfig, ...config };

    // Stomp 클라이언트 생성
    stompClient = new Client({
      brokerURL: finalConfig.brokerURL,
      reconnectDelay: finalConfig.reconnectDelay,
      heartbeatIncoming: finalConfig.heartbeatIncoming,
      heartbeatOutgoing: finalConfig.heartbeatOutgoing,
      connectHeaders: token ? { 'Authorization': `Bearer ${token}` } : {},
      onConnect: () => {
        console.log('WebSocket 연결 성공');
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 해제');
      },
      onStompError: (frame: IFrame) => {
        console.error('WebSocket 에러:', frame);
      },
      // debug 함수 설정 - boolean 대신 항상 함수로 전달
      debug: finalConfig.debug 
        ? (str: string) => { console.log(str); }
        : () => { /* 디버그 비활성화 */ }
    });

    // 연결 시작
    stompClient.activate();
    return stompClient;
  },

  /**
   * WebSocket 연결 해제
   */
  disconnect: (): void => {
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
      stompClient = null;
      subscriptions.clear();
      console.log('WebSocket 연결 해제됨');
    }
  },

  /**
   * 특정 채팅방 메시지 구독
   * @param chatroomId 채팅방 ID
   * @param callback 메시지 수신 시 호출할 콜백 함수
   * @returns 구독 ID (구독 해제 시 필요)
   */
  subscribeToChatRoom: (chatroomId: number, callback: (message: IChatMessage) => void): string => {
    if (!stompClient || !stompClient.connected) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return '';
    }

    const destination = `/topic/chat.${chatroomId}`;
    
    // 이미 구독 중인지 확인
    if (subscriptions.has(destination)) {
      console.log(`이미 채팅방 ${chatroomId}를 구독 중입니다.`);
      return destination;
    }

    // 새 구독 생성
    const subscription = stompClient.subscribe(destination, (message: IMessage) => {
      try {
        const chatMessage: IChatMessage = JSON.parse(message.body);
        callback(chatMessage);
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
      }
    });

    // 구독 정보 저장
    subscriptions.set(destination, subscription);
    console.log(`채팅방 ${chatroomId} 구독 시작`);
    return destination;
  },

  /**
   * 개인 알림 구독
   * @param userEmail 사용자 이메일
   * @param callback 알림 수신 시 호출할 콜백 함수
   * @returns 구독 ID (구독 해제 시 필요)
   */
  subscribeToUserNotifications: (userEmail: string, callback: (notification: INotification) => void): string => {
    if (!stompClient || !stompClient.connected) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return '';
    }

    const destination = `/topic/user/${userEmail}`;
    
    // 이미 구독 중인지 확인
    if (subscriptions.has(destination)) {
      console.log(`이미 사용자 ${userEmail}의 알림을 구독 중입니다.`);
      return destination;
    }

    // 새 구독 생성
    const subscription = stompClient.subscribe(destination, (message: IMessage) => {
      try {
        const notification: INotification = JSON.parse(message.body);
        callback(notification);
      } catch (error) {
        console.error('알림 메시지 파싱 오류:', error);
      }
    });

    // 구독 정보 저장
    subscriptions.set(destination, subscription);
    console.log(`사용자 ${userEmail}의 알림 구독 시작`);
    return destination;
  },

  /**
   * 메시지 전송
   * @param destination 목적지 (예: /app/chat.message)
   * @param body 전송할 메시지 본문
   */
  send: (destination: string, body: unknown): void => {
    if (!stompClient || !stompClient.connected) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return;
    }

    stompClient.publish({
      destination,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
  },

  /**
   * 채팅 메시지 전송
   * @param message 전송할 채팅 메시지
   */
  sendChatMessage: (message: Omit<IChatMessage, 'messageId' | 'sentAt' | 'senderName' | 'senderProfileUrl'>): void => {
    websocketService.send('/app/chat.message', message);
  },

  /**
   * 구독 해제
   * @param subscriptionId 구독 ID
   */
  unsubscribe: (subscriptionId: string): void => {
    const subscription = subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      subscriptions.delete(subscriptionId);
      console.log(`구독 해제: ${subscriptionId}`);
    }
  },

  /**
   * 모든 구독 해제
   */
  unsubscribeAll: (): void => {
    subscriptions.forEach((subscription, id) => {
      subscription.unsubscribe();
      console.log(`구독 해제: ${id}`);
    });
    subscriptions.clear();
  },

  /**
   * 연결 상태 확인
   * @returns 연결 상태 (true: 연결됨, false: 연결 안됨)
   */
  isConnected: (): boolean => {
    return !!(stompClient && stompClient.connected);
  }
}; 