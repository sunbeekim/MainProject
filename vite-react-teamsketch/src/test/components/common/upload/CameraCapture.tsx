import React, { useRef, useState } from 'react';
import Button from '../button/Button';
import CameraModal from './CameraModal';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  className?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, className = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const startCamera = async () => {
    try {
      // 먼저 isActive를 true로 설정하여 모달을 표시
      setIsActive(true);

      let stream: MediaStream | null = null;
      
      // 브라우저 카메라 지원 여부 확인
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('이 브라우저는 카메라를 지원하지 않습니다.');
      }

      if (!isMobile) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      } else {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          });
        } catch (err) {
          console.log('후면 카메라 접근 실패, 전면 카메라 시도:', err);
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          });
        }
      }

      if (!stream) {
        throw new Error('카메라 스트림을 가져올 수 없습니다.');
      }

      if (!videoRef.current) {
        throw new Error('비디오 요소를 찾을 수 없습니다.');
      }

      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // 비디오 로딩 완료 대기
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return reject(new Error('비디오 요소를 찾을 수 없습니다.'));
        
        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) return reject(new Error('비디오 요소를 찾을 수 없습니다.'));
          
          videoRef.current.play()
            .then(() => resolve())
            .catch((error) => {
              console.error('비디오 재생 실패:', error);
              reject(new Error('카메라 화면을 표시할 수 없습니다.'));
            });
        };

        videoRef.current.onerror = () => {
          reject(new Error('비디오 로딩 중 오류가 발생했습니다.'));
        };
      });

      console.log('카메라 시작 성공');

    } catch (error) {
      console.error('카메라 접근 실패:', error);
      stopCamera(); // 에러 발생 시 카메라 정리
      alert(error instanceof Error ? error.message : '카메라를 시작할 수 없습니다.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
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
            const file = new File([blob], 'card-photo.jpg', { type: 'image/jpeg' });
            onCapture(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={startCamera}
        className="flex items-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        카드 촬영
      </Button>

      {isActive && (
        <CameraModal
          videoRef={videoRef as React.RefObject<HTMLVideoElement>}
          onCapture={capturePhoto}
          onClose={stopCamera}
        />
      )}
    </div>
  );
};

export default CameraCapture; 