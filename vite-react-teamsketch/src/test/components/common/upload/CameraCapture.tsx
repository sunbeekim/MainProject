import React, { useRef, useState } from 'react';
import Button from '../button/Button';
import CardFrame from './CardFrame';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  className?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, className = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      alert('카메라를 시작할 수 없습니다.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            onCapture(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className={className}>
      {!isActive ? (
        <Button
          variant="outline"
          onClick={startCamera}
          className="flex items-center gap-2"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          사진 촬영
        </Button>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="max-w-xs rounded-lg"
          />
          
          {/* 카드 프레임 컴포넌트 */}
          <CardFrame guideText="신용카드를 프레임 안에 맞춰주세요" />

          <div className="flex gap-2 mt-4 justify-center">
            <Button variant="primary" onClick={capturePhoto}>촬영</Button>
            <Button variant="outline" onClick={stopCamera}>취소</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture; 