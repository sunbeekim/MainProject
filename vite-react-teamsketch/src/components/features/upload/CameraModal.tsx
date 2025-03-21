import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CardFrame from './CardFrame';
import { detectCard } from '../../../utils/cardDetection';

interface CameraModalProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ videoRef, onCapture, onClose }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    // 캔버스 크기를 비디오 크기와 동일하게 설정
    const updateCanvasSize = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    };

    // 카드 감지 프레임 분석
    const detectFrame = () => {
        if (detectCard(video, canvas)) {
            console.log('카드 감지됨 - 자동 캡처');
            onCapture();
            return;
        }
        detectionRef.current = requestAnimationFrame(detectFrame);
    };

    // 비디오 메타데이터 로드 완료 시 감지 시작
    video.addEventListener('loadedmetadata', () => {
        updateCanvasSize();
        detectionRef.current = requestAnimationFrame(detectFrame);
    });

    return () => {
        if (detectionRef.current) {
            cancelAnimationFrame(detectionRef.current);
        }
    };
  }, [videoRef, onCapture]);

  // ESC 키 이벤트 핸들러
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="relative h-full flex flex-col">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[10000] text-white bg-secondary-light rounded-full p-2"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 비디오 영역 */}
        <div className="flex-1 relative flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full ${isMobile ? 'object-contain' : 'object-cover'}`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* 카드 프레임 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CardFrame
              guideText="카드를 프레임에 맞추면 자동으로 촬영됩니다"
            />
          </div>
        </div>

        {/* 수동 캡처 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
          <button
            onClick={onCapture}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm p-1.5"
          >
            <div className="w-full h-full rounded-full bg-white">
              <div className="w-[85%] h-[85%] rounded-full bg-secondary-light" />
            </div>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CameraModal;
