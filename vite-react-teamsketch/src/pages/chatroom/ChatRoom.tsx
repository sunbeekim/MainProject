import React from "react";
import { useNavigate } from "react-router-dom";
import MessageInput from "./MessageInput";
import { useState } from "react";


interface ChatRoomProps{
    nickname: string;
  
}

interface Message {
  text: string;
  timestamp: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ nickname }) => { 
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  



   const handleBackClick = () => {
    navigate(-1); // 뒤로가기 버튼 클릭 시 이전 페이지로 이동
  };

  const handleSendMessage = (message: string) => {
    const currentTimestamp = new Date().toLocaleString();
    const newMessage: Message = {
      text: message,
      timestamp: currentTimestamp,
    };
    setMessages([...messages, newMessage]);
  };

  const handleMessageDelete = (index: number) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    //해당 인덱스의 메시지 삭제
    setMessages(updatedMessages);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 헤더 */}
      <div className="bg-[#ECCEF5] p-1 text-white flex items-center justify-between shadow-md">
        {/* 뒤로가기 버튼 */}
        <button 
          onClick={handleBackClick}
          className="text-white text-xl font-semibold">
          &#8592; </button>

        {/* 채팅 상대 정보 (닉네임) */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">닉네임{nickname}</span>
        </div>

        <div></div> {/* 뒤로가기 버튼과 상대 정보 외의 공간 */}
      </div>

       {/* 채팅 메시지 목록 */}
       <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4 items-center gap-2">
            <div className="bg-white p-3 rounded-lg shadow-md w-max flex-1">{msg.text}</div>
            <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div> 
            
          
            {/* 메시지 삭제 버튼 */}
              <button
              onClick={() => handleMessageDelete(index)}
              className=" text-gray-400 hover:text-secondary-dark hover:bg-transparent bg-transparent py-0 px-0.5 text-xs"
            >
              삭제
              </button>
              
          </div>
        ))}
      </div>

       {/* 메시지 입력창 */}
       <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;