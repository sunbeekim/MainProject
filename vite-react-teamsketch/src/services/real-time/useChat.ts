import { useEffect, useCallback } from 'react';
import ChatWebSocket from './chat';

export const useChat = () => {
  const chatWebSocket = ChatWebSocket.getInstance();

  useEffect(() => {
    chatWebSocket.connect();

    return () => {
      chatWebSocket.disconnect();
    };
  }, []);

  const subscribe = useCallback((chatroomId: number, callback: (message: any) => void) => {
    chatWebSocket.subscribe(chatroomId, callback);
  }, []);

  const unsubscribe = useCallback((chatroomId: number) => {
    chatWebSocket.unsubscribe(chatroomId);
  }, []);

  const sendMessage = useCallback((chatroomId: number, message: any) => {
    chatWebSocket.sendMessage(chatroomId, message);
  }, []);

  return {
    subscribe,
    unsubscribe,
    sendMessage,
    isConnected: chatWebSocket.isConnected()
  };
}; 