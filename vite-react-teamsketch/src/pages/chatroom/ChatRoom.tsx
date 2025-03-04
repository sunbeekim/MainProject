import React from "react";
import { useNavigate } from "react-router-dom";



interface ChatRoomProps{
    nickname: string;
   // imageUrl: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ nickname }) => { 
   const navigate = useNavigate();

   const handleBackClick = () => {
    navigate(-1); // 뒤로가기 버튼 클릭 시 이전 페이지로 이동
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 헤더 */}
      <div className="bg-[#ECCEF5] p-4 text-white flex items-center justify-between shadow-md">
        {/* 뒤로가기 버튼 */}
        <button 
          onClick={handleBackClick}
          className="text-white text-xl font-semibold">
          &#8592;back </button>

        {/* 채팅 상대 정보 (닉네임) */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">닉네임{nickname}</span>
        </div>

        <div></div> {/* 뒤로가기 버튼과 상대 정보 외의 공간 */}
      </div>

      {/* 채팅 메시지 목록 */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {/* 채팅 메시지 예시 */}
        <div className="mb-4">
          <div className="bg-white p-3 rounded-lg shadow w-max">안녕!</div>
        </div>
        <div className="mb-4 text-right">
          <div className="bg-[#FBCCC5] text-white p-3 rounded-lg shadow w-max inline-block">
            안녕하세요!
          </div>
        </div>
      </div>

      {/* 메시지 입력창 */}
      <div className="bg-white p-4 border-t flex items-center gap-2">
        <input className="flex-1 p-2 border rounded-lg border-[#FBCCC5] " placeholder="메시지 입력..." />
        <button className="bg-[#FBCCC5] hover:bg-[#F9B0BA] text-white px-4 py-2 rounded-lg">전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;