import React from 'react';

interface CardFrameProps {
  guideText?: string;
  className?: string;
}

const CardFrame: React.FC<CardFrameProps> = ({
  guideText = '카드를 프레임 안에 맞춰주세요',
  className = ''
}) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const cardRatio = 53.98 / 85.6;  // 실제 신용카드 비율
  
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <div className={`relative ${
        isMobile 
        ? `w-[85vw] h-[${Math.floor(85 * cardRatio)}vw]`  // 모바일에서는 화면 너비의 85%에 맞춘 높이
        : 'w-[85.6mm] h-[53.98mm]'  // 데스크톱에서는 실제 카드 크기
      }`}>
        {/* 외부 반투명 오버레이 */}
        <div className="absolute inset-0 -m-[100vh] bg-black/50" />

        {/* 카드 프레임 영역 - 부드러운 모서리의 사각형 */}
        <div className="absolute inset-0 rounded-xl">
          {/* 전체 테두리 */}
          <div className="absolute inset-0 border-2 border-white rounded-xl overflow-hidden" />
          
          {/* 상단 가로 라인 */}
          <div className="absolute top-0 left-2 right-2 h-[2px] bg-white" />
          
          {/* 하단 가로 라인 */}
          <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-white" />
          
          {/* 좌측 세로 라인 */}
          <div className="absolute top-2 bottom-2 left-0 w-[2px] bg-white" />
          
          {/* 우측 세로 라인 */}
          <div className="absolute top-2 bottom-2 right-0 w-[2px] bg-white" />

          {/* 모서리 마커 - 더 부드럽게 */}
          <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-white rounded-full" />
            <div className="absolute top-0 left-0 h-full w-[3px] bg-white rounded-full" />
          </div>
          <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-[3px] bg-white rounded-full" />
            <div className="absolute top-0 right-0 h-full w-[3px] bg-white rounded-full" />
          </div>
          <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-xl overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-full" />
            <div className="absolute bottom-0 left-0 h-full w-[3px] bg-white rounded-full" />
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-br-xl overflow-hidden">
            <div className="absolute bottom-0 right-0 w-full h-[3px] bg-white rounded-full" />
            <div className="absolute bottom-0 right-0 h-full w-[3px] bg-white rounded-full" />
          </div>
        </div>

        {/* 가이드 텍스트 */}
        <div className="absolute -top-10 left-0 right-0 text-center text-white text-base font-medium">
          {guideText}
        </div>
      </div>
    </div>
  );
};

export default CardFrame;
