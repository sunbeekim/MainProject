import React from 'react';

interface CardInfo {
  name: string;
  number: string;
  owner: string;
  expiryDate: string;
}

interface CardPreviewProps {
  ocrResult: {
    data: {
      response: CardInfo;
    };
  };
}


  
const CardPreview: React.FC<CardPreviewProps> = ({ ocrResult }) => {
  const cardInfo = ocrResult.data.response; // ocrResult에서 cardInfo로 할당

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* 디자인만 남기고 파일 업로드 부분 제거 */}
      <div className="w-96 h-56 relative bg-gradient-to-r from-purple-400 to-violet-500 text-white p-6 rounded-xl shadow-md">
        <div className="text-lg font-semibold">{cardInfo.name}</div> {/* cardInfo 사용 */}
        <div className="w-12 h-8 bg-yellow-400 rounded-sm absolute top-16 left-5"></div>
        <div className="mt-12 text-2xl font-bold tracking-widest text-gray-100">
          {cardInfo.number.replace(/(\d{4})/g, "$1 ")} {/* cardInfo 사용 */}
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <span className="absolute bottom-5 left-5 text-base font-medium tracking-wider">{cardInfo.owner}</span> {/* cardInfo 사용 */}
          <span className="text-gray-300 text-xs">VALID THRU</span>
          <span className="ml-2 text-base font-semibold">{cardInfo.expiryDate}</span> {/* cardInfo 사용 */}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
