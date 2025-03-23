import { useState, useEffect, useCallback } from 'react';
import { websocketService } from './websocketService';
import { useDispatch } from 'react-redux';
import { setYourLocation } from '../../store/slices/mapSlice';
import { getAddressFromCoords } from '../../services/third-party/myLocation';

export interface LocationHookProps {
  chatroomId?: number;
  userEmail?: string;
  token?: string;
}

export interface LocationHookReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  shareLocation: () => void;
}

/**
 * 실시간 위치 공유 기능을 위한 React Hook
 * @param props 위치 공유에 필요한 설정
 * @returns 위치 관련 상태와 기능
 */
export const useLocation = ({
  chatroomId,
  userEmail,
  token
}: LocationHookProps): LocationHookReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const dispatch = useDispatch();

  // 웹소켓 연결
  const connect = useCallback(async () => {
    if (!userEmail || !token || !chatroomId) {
      console.error('연결에 필요한 정보가 없습니다.');
      return;
    }

    if (isConnected || isConnecting) {
      console.log('이미 연결되어 있거나 연결 시도 중입니다.');
      return;
    }

    try {
      setIsConnecting(true);
      websocketService.connect(token);
      
      // 연결 상태 확인을 위해 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
      const connected = websocketService.isConnected();
      setIsConnected(connected);
      console.log('웹소켓 연결 상태:', connected);
    } catch (error) {
      console.error('웹소켓 연결 오류:', error);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [userEmail, token, chatroomId, isConnected, isConnecting]);

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
  }, []);

  // 위치 공유
  const shareLocation = useCallback(() => {
    if (!chatroomId || !userEmail || !isConnected) {
      console.error('위치를 공유할 수 없습니다. 연결 상태와 필수 정보를 확인하세요.');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          
          try {
            // 주소 가져오기
            const address = await getAddressFromCoords(lat, lng);
            
            // 위치 정보 전송
            websocketService.sendLocationUpdate(chatroomId, userEmail, lat, lng);
            
            console.log('위치 공유 완료:', { lat, lng, address });
          } catch (error) {
            console.error('위치 공유 중 오류 발생:', error);
          }
        },
        (error) => {
          console.error('위치 정보를 가져오지 못했습니다:', error);
        }
      );
    } else {
      console.error('이 브라우저에서는 위치 정보를 사용할 수 없습니다.');
    }
  }, [chatroomId, userEmail, isConnected]);

  // 위치 업데이트 구독
  useEffect(() => {
    if (!chatroomId || !userEmail || !isConnected) return;

    const subscriptionId = websocketService.subscribeToLocationUpdates(
      chatroomId,
      async (locationUpdate) => {
        if (locationUpdate.email !== userEmail) {
          try {
            const address = await getAddressFromCoords(locationUpdate.lat, locationUpdate.lng);
            dispatch(setYourLocation({
              lat: locationUpdate.lat,
              lng: locationUpdate.lng,
              address,
              meetingPlace: address?.split(' ')[0] || ''
            }));
          } catch (error) {
            console.error('상대방 위치 주소 변환 중 오류:', error);
          }
        }
      }
    );

    return () => {
      if (subscriptionId) {
        websocketService.unsubscribe(subscriptionId);
      }
    };
  }, [chatroomId, userEmail, isConnected, dispatch]);

  // 컴포넌트 마운트 시 연결
  useEffect(() => {
    if (userEmail && token && chatroomId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, userEmail, token, chatroomId]);

  return {
    isConnected,
    connect,
    disconnect,
    shareLocation
  };
}; 