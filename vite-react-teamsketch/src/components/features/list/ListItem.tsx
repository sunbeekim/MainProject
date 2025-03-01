import React from "react";
import { useNavigate } from 'react-router-dom';


interface ListItemProps{
  nickname: string;
  title: string;          
  description: string;    
  points: number;        
}

const ListItem: React.FC<ListItemProps> = ({nickname, title, description, points }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/test/productdetails');
  };

    return (
        <div className="w-[600px] h-[150px] bg-white rounded-2xl shadow-lg flex items-center p-4 gap-4">
       
        <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg">
          <img src="https://picsum.photos/600/400" alt="이미지" className="item-image" />
        </div>
  
        <div className="flex flex-col flex-1 w-full">
        <span className="text-gray-400 text-xs">{nickname}</span>
          <h3 className="text-lg font-semibold ">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>

          <div className="flex flex-col items-left">
            <span>{points} point</span>
          </div>
        </div>
        
        <button className="bg-[#FBCCC5] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#F9B0BA]" onClick={handleClick}>
          상세보기
        </button>
      </div>
    );
};
export default ListItem;