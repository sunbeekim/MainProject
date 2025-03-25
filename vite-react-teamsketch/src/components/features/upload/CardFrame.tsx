import React from 'react';

interface CardFrameProps {
  guideText?: string;
  className?: string;
}

const CardFrame: React.FC<CardFrameProps> = ({
  guideText = '',
  className = ''
}) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  // const cardRatio = 53.98 / 85.6;  // 실제 신용카드 비율
  
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <div className={`relative ${
        isMobile 
        ? 'w-[95vw] h-[60vw]'  // 모바일에서는 화면 너비의 95%로 조정
        : 'w-[450px] h-[280px]'  // 데스크톱에서는 더 큰 크기로 설정
      }`}>        

        {/* 카드 프레임 영역 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {/* 전체 테두리 */}
          <div className="absolute inset-0 border-4 border-white/90 rounded-2xl" />
          
          {/* 상단 가로 라인 */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-white/80" />
          
          {/* 하단 가로 라인 */}
          <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-white/80" />
          
          {/* 좌측 세로 라인 */}
          <div className="absolute top-8 bottom-8 left-0 w-[2px] bg-white/80" />
          
          {/* 우측 세로 라인 */}
          <div className="absolute top-8 bottom-8 right-0 w-[2px] bg-white/80" />
        </div>

        {/* 가이드 텍스트 */}
        <div className="absolute -top-16 left-0 right-0 text-center">
          <p className="text-white text-sm font-medium">
            {guideText}
          </p>
          <div className="mt-3 w-16 h-1.5 bg-white/40 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default CardFrame;
