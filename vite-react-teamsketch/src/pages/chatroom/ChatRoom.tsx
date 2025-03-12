import React from "react";
import { useNavigate } from "react-router-dom";
import MessageInput from "./MessageInput";
import { useState } from "react";
import { useRef, useEffect } from "react";

interface ChatRoomProps{
    nickname?: string;
    imageUrl?: string;
}

interface Message {
  text?: string;
  file?: { type: string; url: string; name?: string };//파일 정보
  timestamp: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ nickname,imageUrl }) => { 
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState(true);
  


  const handleJoinClick = () => {
    if (show) {
    console.log("함께하기 버튼 클릭됨");
    setShow(false); // show 값 false로 변경 (신청 불가 상태)
      setIsDisabled(true); // 버튼 비활성화
    }
  };

   const handleBackClick = () => {
    navigate(-1); // 뒤로가기 버튼 클릭 시 이전 페이지로 이동
  };

  const handleSendMessage = (message: string, file?: { type: string; url: string; name?: string }) => {
    if (!message.trim() && !file) return;
    const currentTimestamp = new Date().toLocaleString();//현재 시간을 가져옴
    const newMessage: Message = {//메시지,파일,시간 추가
      text: message || undefined,
      file: file || undefined,
      timestamp: currentTimestamp,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleMessageDelete = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));//해당 메시지 삭제
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;//최신 메시지로
      console.log("isDisabled updated: ", isDisabled);
    }
  }, [messages,isDisabled]); 

  
  return (
    <div className="flex flex-col h-screen relative">
    {/* 상단 헤더 (고정) */}
      <div className="bg-[#ECCEF5] p-1 text-white flex items-center justify-between shadow-md sticky top-0 z-10 w-full">
         {/* 뒤로가기 버튼 */}
      <button onClick={handleBackClick} className="text-white text-xl font-semibold">
        &#8592;</button>

        {/* 채팅 상대 정보 (닉네임) */}
        <div>
          <span className="text-lg font-semibold">닉네임{nickname}</span>
        </div>

        <div className="flex items-center gap-2">
           {/* 함께하기 버튼*/}
        <button 
          onClick={handleJoinClick} 
        className="text-white px-4 py-2 rounded-md bg-transparent hover:bg-secondary z-10 disabled:hover:bg-transparent "
        disabled={isDisabled}
        > 함께하기 </button>
              <div><img src={imageUrl || "https://picsum.photos/600/400"}  alt="프로필 사진" 
        className="w-8 h-8 rounded-full object-cover mr-4"></img></div> {/* 뒤로가기 버튼과 상대 정보 외의 공간 */}
        </div>
      </div>

       {/* 채팅 메시지 목록 */}
       <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-100 h-[calc(100vh-150px)] ">
        {messages.map((msg, index) => (
          <div key={index} className="mb-5">
            {/* 파일이 있을 경우, 파일을 렌더링 */}
            {msg.file ? (
              msg.file.type === "image" ? (
                <img src={msg.file.url} alt="전송된 이미지" className="w-32 h-32 rounded-md shadow-md" />// 이미지 미리보기
              ) : msg.file.type === "video" ? (
                <video controls className="w-32 h-32 rounded-md shadow-md">
                  <source src={msg.file.url} type="video/mp4" />
                </video>// 비디오 미리보기
              ) : (
                <a href={msg.file.url} download={msg.file.name} className="block-1 p-2 border text-sm text-black rounded-lg bg-white shadow-md
                ">
                  📄 {msg.file.name} (다운로드)
                </a>//파일 미리보기
              )
            ) : (
              <div className="bg-white p-3 rounded-lg shadow-md w-max">{msg.text}</div>//텍스트 메시지
            )}

            {/* 메시지 전송 시간 표시 */}
            <div className="text-xs text-gray-500 mt-2">{msg.timestamp}</div>
          
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
    
    <div className="flex items-center fixed bottom-0 left-0 right-0 bg-white shadow-md p-4">
  {/* 메시지 입력창 */}
  <MessageInput onSendMessage={handleSendMessage} />
    </div>    
  </div>
      
  );
};

export default ChatRoom;