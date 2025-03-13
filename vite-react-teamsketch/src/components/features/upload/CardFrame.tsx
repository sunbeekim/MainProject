import React from 'react';

interface CardFrameProps {
  guideText?: string;
  className?: string;
}

const CardFrame: React.FC<CardFrameProps> = ({
  guideText = '카드를 프레임 안에 맞춰주세요',
  className = ''
}) => {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <div className="relative w-[115.56mm] h-[72.9mm]">
        {/* 외부 반투명 오버레이 */}
        <div className="absolute inset-0 -m-[100vh] bg-black/50" />

        {/* 카드 프레임 영역 */}
        <div className="absolute inset-0 border-2 border-white rounded-lg">
          {/* 프레임 내부 영역을 투명하게 */}
          <div className="absolute inset-0 -m-[1px] bg-transparent" />

          {/* 모서리 마커 */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white" />
        </div>

        {/* 가이드 텍스트 위치도 조정 */}
        <div className="absolute -top-10 left-0 right-0 text-center text-white text-base font-medium">
          {guideText}
        </div>
      </div>
    </div>
  );
};

export default CardFrame;
