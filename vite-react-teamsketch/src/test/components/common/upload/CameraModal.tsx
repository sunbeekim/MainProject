import React from 'react';
import Button from '../button/Button';
import CardFrame from './CardFrame';

interface CameraModalProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ videoRef, onCapture, onClose }) => {
  // ESC 키 이벤트 핸들러 추가
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
          aria-label="닫기"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-lg"
            style={{ maxHeight: 'calc(80vh - 8rem)' }}
          />
          
          <CardFrame guideText="신용카드를 프레임 안에 맞춰주세요" />
        </div>

        <div className="flex gap-2 mt-4 justify-center">
          <Button variant="primary" onClick={onCapture}>촬영</Button>
          <Button variant="outline" onClick={onClose}>취소</Button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal; 