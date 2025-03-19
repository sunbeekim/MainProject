import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet 기본 CSS
import './Leaflet.css'; // 커스텀 CSS
import { RootState } from '../../../store/store';
import { setEndLocation, setMyLocation, setYourLocation } from '../../../store/slices/mapSlice';
import { getAddressFromCoord } from '../../../services/api/productAPI';

interface OpenStreetMapProps {
  children?: React.ReactNode;
  nonClickable?: boolean;
  className?: string;
  mode?: 'myLocation' | 'yourLocation' | 'endLocation';
}

const OpenMap: React.FC<OpenStreetMapProps> = ({ nonClickable = false, className, mode = 'endLocation' }) => {
  const dispatch = useDispatch();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const { myLocation, yourLocation, endLocation } = useSelector((state: RootState) => state.map);

  // 초기 지도 생성
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const defaultLocation: [number, number] = [37.5665, 126.978]; // 서울 기본 위치
      const newMap = L.map(mapRef.current).setView(defaultLocation, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(newMap);

      // 지도 클릭 이벤트 처리
      newMap.on('click', async (e) => {
        if (nonClickable) return;
        const { lat, lng } = e.latlng;
        const location = await getAddressFromCoord(lat, lng);
        console.log('location', location);
        
        switch (mode) {
          case 'myLocation':
            console.log('myLocation');
            dispatch(setMyLocation({
              lat,
              lng,
              address: `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`,
              meetingPlace: location.name
            }));
            break;
          case 'yourLocation':
            console.log('yourLocation');
            dispatch(setYourLocation({
              lat,
              lng,
              address: `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`,
              meetingPlace: location.name
            }));
            break;
          case 'endLocation':
            console.log('endLocation');
            dispatch(setEndLocation({
              lat,
              lng,
              address: `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`,
              meetingPlace: location.name
            }));
            break;
        }
      });

      mapInstanceRef.current = newMap;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markers.forEach((marker) => marker.remove());
    const newMarkers: L.Marker[] = [];

    // 내 위치 마커 (파란색)
    if (myLocation.lat && myLocation.lng) {
      const myIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-content" style="background-color: #3B82F6;"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const marker = L.marker([myLocation.lat, myLocation.lng], { icon: myIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('내 위치');
      newMarkers.push(marker);
      mapInstanceRef.current.setView([myLocation.lat, myLocation.lng], 13);
    }

    // 상대방 위치 마커 (빨간색)
    if (yourLocation.lat && yourLocation.lng) {
      const yourIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-content" style="background-color: #EF4444;"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const marker = L.marker([yourLocation.lat, yourLocation.lng], { icon: yourIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('상대방 위치');
      newMarkers.push(marker);
      mapInstanceRef.current.setView([yourLocation.lat, yourLocation.lng], 13);
    }

    // 목적지 마커 (초록색)
    if (endLocation.lat && endLocation.lng) {
      const endIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-content" style="background-color: #10B981;"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const marker = L.marker([endLocation.lat, endLocation.lng], { icon: endIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('목적지');
      newMarkers.push(marker);
      mapInstanceRef.current.setView([endLocation.lat, endLocation.lng], 13);
    }

    setMarkers(newMarkers);
  }, [myLocation, yourLocation, endLocation]);

  return <div ref={mapRef} className={`w-full h-full ${className}`} />;
};

export default OpenMap;
