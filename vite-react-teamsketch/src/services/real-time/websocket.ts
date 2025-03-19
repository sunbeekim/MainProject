
interface IWebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private messageHandlers: Map<string, ((data: any) => void)[]> = new Map();

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private connect() {
    try {
      this.ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws');

      this.ws.onopen = () => {
        console.log('WebSocket 연결 성공');
        this.reconnectAttempts = 0;
        this.authenticate();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: IWebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket 연결 종료');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 오류:', error);
      };
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`WebSocket 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      console.error('WebSocket 최대 재연결 시도 횟수 초과');
    }
  }

  private authenticate() {
    const token = localStorage.getItem('token');
    if (token && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'auth',
        data: { token }
      }));
    }
  }

  private handleMessage(message: IWebSocketMessage) {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message.data));
    }
  }

  public addMessageHandler(type: string, handler: (data: any) => void) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)?.push(handler);
  }

  public removeMessageHandler(type: string, handler: (data: any) => void) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length === 0) {
        this.messageHandlers.delete(type);
      }
    }
  }

  public sendMessage(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type,
        data,
        timestamp: Date.now()
      }));
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }
}

// 위치 업데이트 전송 예시
export const sendLocationUpdate = (chatRoomId: string, location: { lat: number; lng: number; address: string; meetingPlace: string }) => {
  const ws = WebSocketManager.getInstance();
  ws.sendMessage('location_update', {
    chatRoomId,
    ...location
  });
};

// 채팅 메시지 전송 예시
export const sendChatMessage = (chatRoomId: string, message: string) => {
  const ws = WebSocketManager.getInstance();
  ws.sendMessage('chat_message', {
    chatRoomId,
    message
  });
};

export default WebSocketManager;
