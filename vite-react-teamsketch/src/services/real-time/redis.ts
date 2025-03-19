import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import { apiConfig } from '../api/apiConfig';
import { websocketInstance } from '../api/axiosInstance';

class RedisSubscriber {
  private static instance: RedisSubscriber;
  private stompClient: Client | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 3000;
  private subscriptions: Map<string, (message: any) => void> = new Map();
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): RedisSubscriber {
    if (!RedisSubscriber.instance) {
      RedisSubscriber.instance = new RedisSubscriber();
    }
    return RedisSubscriber.instance;
  }

  public async connect() {
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

      const socket = new SockJS(await websocketInstance.get(apiConfig.endpoints.core.realtimeRedis), null, {
        transports: ['websocket'],
        sessionId: () => `redis-session-${Date.now()}`
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
          console.log('Redis WebSocket 연결 성공');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          toast.success('Redis 실시간 알림이 연결되었습니다.');
          this.resubscribeAll();
        },
        onStompError: (frame) => {
          console.error('Redis WebSocket 연결 실패:', frame);
          this.isConnecting = false;
          this.handleReconnect();
        }
      });

      this.stompClient.activate();
    } catch (error) {
      console.error('Redis WebSocket 초기화 실패:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.error('Redis 최대 재연결 시도 횟수 초과');
      toast.error('Redis 실시간 알림 연결에 실패했습니다. 페이지를 새로고침해주세요.');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Redis 재연결 시도 ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
    
    setTimeout(() => {
      console.log('Redis 재연결 시도 중...');
      this.connect();
    }, this.RECONNECT_DELAY);
  }

  public subscribe(channel: string, callback: (message: any) => void) {
    if (!this.stompClient?.connected) {
      console.error('Redis WebSocket이 연결되어 있지 않습니다.');
      return;
    }

    try {
      this.subscriptions.set(channel, callback);
      this.stompClient.subscribe(`/redis/messages/${channel}`, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log(`Redis ${channel} 메시지 수신:`, data);
          callback(data);
        } catch (error) {
          console.error('Redis 메시지 파싱 오류:', error);
        }
      });
    } catch (error) {
      console.error('Redis 구독 중 오류 발생:', error);
    }
  }

  private resubscribeAll() {
    this.subscriptions.forEach((callback, channel) => {
      this.subscribe(channel, callback);
    });
  }

  public unsubscribe(channel: string) {
    if (this.stompClient?.connected) {
      this.stompClient.unsubscribe(`/redis/messages/${channel}`);
      this.subscriptions.delete(channel);
    }
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('Redis WebSocket 연결 해제');
      this.subscriptions.clear();
      this.stompClient = null;
    }
  }

  public isConnected(): boolean {
    return this.stompClient?.connected || false;
  }
}

export default RedisSubscriber; 