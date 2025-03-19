import { useEffect, useCallback } from 'react';
import RedisSubscriber from './redis';

export const useRedis = () => {
  const redisSubscriber = RedisSubscriber.getInstance();

  useEffect(() => {
    // 컴포넌트 마운트 시 연결
    redisSubscriber.connect();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      redisSubscriber.disconnect();
    };
  }, []);

  const subscribe = useCallback((channel: string, callback: (message: any) => void) => {
    // 연결이 되어있지 않다면 연결 시도
    if (!redisSubscriber.isConnected()) {
      redisSubscriber.connect();
    }
    
    // 연결이 완료된 후 구독
    const checkConnection = setInterval(() => {
      if (redisSubscriber.isConnected()) {
        redisSubscriber.subscribe(channel, callback);
        clearInterval(checkConnection);
      }
    }, 1000);

    // 10초 후에도 연결되지 않으면 인터벌 제거
    setTimeout(() => {
      clearInterval(checkConnection);
    }, 10000);
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    redisSubscriber.unsubscribe(channel);
  }, []);

  return { subscribe, unsubscribe };
}; 