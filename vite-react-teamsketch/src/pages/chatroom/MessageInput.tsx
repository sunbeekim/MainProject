import React from "react";
import { useState } from "react";


interface MessageInputProps {
    onSendMessage: (message: string, type: "TEXT"|"IMAGE"|"VIDEO"|"FILE",file?: File) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);

   
  
    
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message,"TEXT");
            setMessage("");
        } else if (file) {
            onSendMessage(file.name, "FILE", file); // 파일 전송
            setFile(null); // 파일 업로드 후 상태 초기화
          }

       
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
          setFile(uploadedFile);
         
        }
      };


 
    return (
        <div className="bg-white p-4 border-t flex items-center gap-2 relative">
           <label htmlFor="file-upload" className="p-2 rounded-full hover:bg-primary-light w-7 h-7 flex items-center justify-center cursor-pointer">
        ➕
      </label>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
      />
          

            
         {/* 메시지 입력창 */}   
            <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        className="flex-1 p-2 border rounded-full"
        placeholder="메시지를 입력하세요..."
            />
            {/* 전송 버튼 */}
            <button
                onClick={handleSendMessage}
                className="bg-[#FBCCC5] hover:bg-[#F9B0BA] text-white px-4 py-2 rounded-lg">전송</button>
            </div>
    );
};
export default MessageInput;