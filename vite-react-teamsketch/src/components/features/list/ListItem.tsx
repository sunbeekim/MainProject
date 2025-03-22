import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ListItemProps {
  nickname: string;
  title: string;
  description: string;
  points: number;
  imageUrl: string; // 이미지 URL을 props로 추가
}

const ListItem: React.FC<ListItemProps> = ({ nickname, title, points, imageUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/transaction-detail/:transactionId');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full sm:w-[600px] h-auto bg-white rounded-2xl border-2 flex items-center p-4 gap-4">
        {/* 상품 이미지 */}
        <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="상품 이미지"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col flex-1 w-full">
          <span className="text-gray-400 text-xs">{nickname}</span>
          <h3 className="text-sm font-semibold truncate">{title}</h3>

          <div className="flex flex-col items-start">
            <span>{points} point</span>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        <button
          className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600 w-[120px] break-words"
          onClick={handleClick}
        >
          상세보기
        </button>
      </div>
    </div>
  );
};

export default ListItem;
