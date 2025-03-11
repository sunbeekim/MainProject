import React from 'react';
import { createPortal } from 'react-dom';
import CardFrame from './CardFrame';

interface CameraModalProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ videoRef, onCapture, onClose }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // ESC 키 이벤트 핸들러
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative h-full flex flex-col">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[10000] text-white bg-secondary-light rounded-full p-2"
          aria-label="닫기"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 비디오 영역 */}
        <div className="flex-1 relative flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

          {/* 카드 프레임 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CardFrame
              guideText={
                isMobile ? '카드를 프레임 안에 맞춰주세요' : '신용카드를 프레임 안에 맞춰주세요'
              }
            />
          </div>
        </div>

        {/* 하단 컨트롤 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
          <button
            onClick={onCapture}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm p-1.5 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="촬영"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
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
