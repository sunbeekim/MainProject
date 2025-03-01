import { useState, useEffect } from 'react';
import OpenStreetMap from '../../components/features/location/OpenStreetMap';
import { getCurrentLocation, watchCurrentLocation, getNearbyRandomLocation, getAddressFromCoords } from '../../services/third-party/myLocation';

interface ILocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const Location = () => {
  const [startLocation, setStartLocation] = useState<ILocation>({
    id: '1',
    name: '현재 위치',
    address: '위치 확인 중...',
    lat: 37.4979,
    lng: 127.0276
  });

  const [endLocation, setEndLocation] = useState<ILocation>({
    id: '2',
    name: '목적지',
    address: '위치 확인 중...',
    lat: 37.5089,
    lng: 127.0631
  });

  // 다른 사용자들의 위치 정보를 저장할 상태
  const [sharedLocations, setSharedLocations] = useState<ILocation[]>([]);

  useEffect(() => {
    // 실시간 위치 추적 시작
    const stopWatching = watchCurrentLocation(
      async (currentLocation) => {
        // 현재 위치 업데이트
        setStartLocation({
          id: '1',
          name: '현재 위치',
          address: currentLocation.address,
          lat: currentLocation.lat,
          lng: currentLocation.lng
        });

        // 목적지 위치 랜덤 업데이트 (1km 반경)
        const randomLocation = getNearbyRandomLocation(currentLocation.lat, currentLocation.lng);
        try {
          const randomAddress = await getAddressFromCoords(randomLocation.lat, randomLocation.lng);
          setEndLocation({
            id: '2',
            name: '목적지',
            address: randomAddress,
            lat: randomLocation.lat,
            lng: randomLocation.lng
          });

          // 상대방의 위치를 현재 위치 기준 3km 반경 내에 설정
          const radius = 0.027; // 약 3km
          const randomAngle = Math.random() * Math.PI * 2;
          const randomRadius = Math.sqrt(Math.random()) * radius;
          
          const otherUser: ILocation = {
            id: 'shared-user',
            name: '상대방',
            address: '위치 공유됨',
            lat: currentLocation.lat + randomRadius * Math.cos(randomAngle),
            lng: currentLocation.lng + randomRadius * Math.sin(randomAngle)
          };

          // 상대방 위치 업데이트
          setSharedLocations([otherUser]);

        } catch (error) {
          console.error('위치 정보 조회 실패:', error);
        }
      },
      (error) => alert(error)
    );

    return () => {
      stopWatching?.();
    };
  }, []);

  const handleCopyLocation = () => {
    const locationText = `${startLocation.address} → ${endLocation.address}`;
    navigator.clipboard.writeText(locationText)
      .then(() => alert('위치 정보가 복사되었습니다.'))
      .catch(() => alert('위치 정보 복사에 실패했습니다.'));
  };

  const handleGetCurrentLocation = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setEndLocation({
        id: '2',
        name: '현재 위치',
        address: currentLocation.address,
        lat: currentLocation.lat,
        lng: currentLocation.lng
      });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="h-screen">      
      <OpenStreetMap 
        startLocation={startLocation}
        endLocation={endLocation}
        sharedLocations={sharedLocations}
        onCopyLocation={handleCopyLocation}
        onGetCurrentLocation={handleGetCurrentLocation}
      />
    </div>
  );
};

export default Location;
