import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';

class ChatWebSocket {
  private static instance: ChatWebSocket;
  private stompClient: Client | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 3000;
  private subscriptions: Map<string, (message: any) => void> = new Map();
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): ChatWebSocket {
    if (!ChatWebSocket.instance) {
      ChatWebSocket.instance = new ChatWebSocket();
    }
    return ChatWebSocket.instance;
  }

  public connect() {
    if (this.isConnecting) {
      console.log('이미 연결 시도 중입니다.');
      return;
    }

    if (this.stompClient?.connected) {
      console.log('이미 연결되어 있습니다.');
      return;
    }

    this.isConnecting = true;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      const socket = new SockJS('http://localhost:8080/ws', null, {
        transports: ['websocket'],
        sessionId: () => `chat-session-${Date.now()}`
      });

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('Chat WebSocket 연결 성공');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          toast.success('채팅 서비스가 연결되었습니다.');
          this.resubscribeAll();
        },
        onStompError: (frame) => {
          console.error('Chat WebSocket 연결 실패:', frame);
          this.isConnecting = false;
          this.handleReconnect();
        }
      });

      this.stompClient.activate();
    } catch (error) {
      console.error('Chat WebSocket 초기화 실패:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error('Chat 최대 재연결 시도 횟수 초과');
      toast.error('채팅 서비스 연결에 실패했습니다. 페이지를 새로고침해주세요.');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Chat 재연결 시도 ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
    
    setTimeout(() => {
      console.log('Chat 재연결 시도 중...');
      this.connect();
    }, this.RECONNECT_DELAY);
  }

  public subscribe(chatroomId: number, callback: (message: any) => void) {
    if (!this.stompClient?.connected) {
      console.error('Chat WebSocket이 연결되어 있지 않습니다.');
      return;
    }

    try {
      const topic = `/topic/chat/room/${chatroomId}`;
      this.subscriptions.set(topic, callback);
      this.stompClient.subscribe(topic, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log(`Chat ${chatroomId} 메시지 수신:`, data);
          callback(data);
        } catch (error) {
          console.error('Chat 메시지 파싱 오류:', error);
        }
      });
    } catch (error) {
      console.error('Chat 구독 중 오류 발생:', error);
    }
  }

  public sendMessage(chatroomId: number, message: any) {
    if (!this.stompClient?.connected) {
      console.error('Chat WebSocket이 연결되어 있지 않습니다.');
      return;
    }

    try {
      this.stompClient.publish({
        destination: '/app/chat.message',
        body: JSON.stringify({
          chatroomId,
          content: message.content,
          messageType: message.messageType || 'TEXT'
        })
      });
    } catch (error) {
      console.error('Chat 메시지 전송 중 오류 발생:', error);
    }
  }

  private resubscribeAll() {
    this.subscriptions.forEach((callback, topic) => {
      const chatroomId = topic.split('/').pop();
      if (chatroomId) {
        this.subscribe(parseInt(chatroomId), callback);
      }
    });
  }

  public unsubscribe(chatroomId: number) {
    if (this.stompClient?.connected) {
      const topic = `/topic/chat/${chatroomId}`;
      this.stompClient.unsubscribe(topic);
      this.subscriptions.delete(topic);
    }
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('Chat WebSocket 연결 해제');
      this.subscriptions.clear();
      this.stompClient = null;
    }
  }

  public isConnected(): boolean {
    return this.stompClient?.connected || false;
  }
}

export default ChatWebSocket; 