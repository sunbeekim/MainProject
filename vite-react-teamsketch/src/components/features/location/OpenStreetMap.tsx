import { useEffect, useRef, useState } from 'react';
import LocationLayout from '../../layout/LocationLayout';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Leaflet 기본 CSS
import './Leaflet.css';  // 커스텀 CSS

interface ILocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface OpenStreetMapProps {
  startLocation: ILocation;
  endLocation: ILocation;
  sharedLocations: ILocation[];
  onCopyLocation: () => void;
  onGetCurrentLocation: () => void;
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ startLocation, endLocation, sharedLocations, onCopyLocation, onGetCurrentLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || map) return; // map이 이미 존재하면 초기화하지 않음

    const mapInstance = L.map(mapRef.current).setView([startLocation.lat, startLocation.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    setMap(mapInstance);
  }, [mapRef.current]);

  // 마커와 경로 업데이트
  useEffect(() => {
    if (!map) return;

    // 기존 마커와 경로 제거
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    // 다른 사용자 마커 스타일
    const sharedLocationStyle = `
      background-color: #00C853;
      width: 24px;
      height: 24px;
      display: block;
      border-radius: 50%;
      border: 2px solid white;
      position: relative;
      box-shadow: 0 0 0 4px rgba(0, 200, 83, 0.2);
    `;

    // 출발지(현재 위치) 마커 스타일
    const startMarkerStyle = `
      background-color: #FF4B4B;
      width: 24px;
      height: 24px;
      display: block;
      border-radius: 50%;
      border: 2px solid white;
      position: relative;
      box-shadow: 0 0 0 8px rgba(255, 75, 75, 0.2);
      animation: pulse 1.5s infinite;
    `;

    // 도착지 마커 스타일
    const endMarkerStyle = `
      background-color: #7048e8;
      width: 24px;
      height: 24px;
      display: block;
      border-radius: 50%;
      border: 2px solid white;
      position: relative;
    `;

    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 75, 75, 0.4);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(255, 75, 75, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 75, 75, 0);
        }
      }
    `;
    document.head.appendChild(style);

    // 출발지 마커 아이콘
    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: `<span style="${startMarkerStyle}"></span>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // 도착지 마커 아이콘
    const endIcon = L.divIcon({
      className: 'custom-marker',
      html: `<span style="${endMarkerStyle}"></span>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // 다른 사용자들의 위치 마커 추가
    const sharedMarkers = sharedLocations.map(location => {
      const sharedIcon = L.divIcon({
        className: 'custom-marker',
        html: `<span style="${sharedLocationStyle}"></span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      return L.marker([location.lat, location.lng], { icon: sharedIcon })
        .bindPopup(`${location.name}: ${location.address}`)
        .addTo(map);
    });

    // 새로운 마커와 경로 추가
    const startMarker = L.marker([startLocation.lat, startLocation.lng], { icon: startIcon })
      .bindPopup(`현재 위치: ${startLocation.address}`)
      .addTo(map);
    const endMarker = L.marker([endLocation.lat, endLocation.lng], { icon: endIcon })
      .bindPopup(`목적지: ${endLocation.address}`)
      .addTo(map);
    
    markersRef.current = [startMarker, endMarker, ...sharedMarkers];

    polylineRef.current = L.polyline(
      [
        [startLocation.lat, startLocation.lng],
        [endLocation.lat, endLocation.lng]
      ],
      {
        color: '#7048e8',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10' // 점선으로 표시
      }
    ).addTo(map);

    // 모든 마커를 포함하는 영역 계산
    const points = [
      [startLocation.lat, startLocation.lng],
      [endLocation.lat, endLocation.lng],
      ...sharedLocations.map(loc => [loc.lat, loc.lng])
    ];
    const bounds = L.latLngBounds(points as L.LatLngExpression[]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // 컴포넌트 언마운트 시 스타일 제거
    return () => {
      document.head.removeChild(style);
    };

  }, [map, startLocation, endLocation, sharedLocations]);

  // 컴포넌트 언마운트 시 지도 정리
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <LocationLayout
      startLocation={startLocation}
      endLocation={endLocation}
      onCopyLocation={onCopyLocation}
      onGetCurrentLocation={onGetCurrentLocation}
    >
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </LocationLayout>
  );
};

export default OpenStreetMap;