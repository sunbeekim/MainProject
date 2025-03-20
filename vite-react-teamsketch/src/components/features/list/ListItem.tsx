import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ListItemProps {
  nickname: string;
  title: string;
  description: string;
  points: number;
  imageUrl: string; // 이미지 URL을 props로 추가
}

const ListItem: React.FC<ListItemProps> = ({ nickname, title, description, points, imageUrl }) => {
  const navigate = useNavigate();


  const handleClick = () => {

    navigate('/transaction-detail/:transactionId')
  }


  return (
    <div className="w-[600px] h-[150px] bg-white rounded-2xl border-2 flex items-center p-4 gap-3">
      <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg">
        <img src={imageUrl} alt="상품 이미지" className="item-image" />
      </div>

      <div className="flex flex-col flex-1 w-full">
        <span className="text-gray-400 text-xs">{nickname}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>

        <div className="flex flex-col items-left">
          <span>{points} point</span>
        </div>
      </div>

      <button
        className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600"
        onClick={handleClick}
      >
        상세보기
      </button>
    </div>
  );
};

export default ListItem;