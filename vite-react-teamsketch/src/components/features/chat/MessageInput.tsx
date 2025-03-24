import React from "react";
import { useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string, file?: { type: string; url: string; name?: string }) => void;
  sendType?: 'normal' | 'application';
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, sendType='application' }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<{ type: string; url: string; name?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type.split("/")[0];//파일 유형
      const fileUrl = URL.createObjectURL(selectedFile);

      setFile({
        type: fileType,
        url: fileUrl,
        name: selectedFile.name,
      });
    }
  };

  const handleSend = () => {
    if (!message.trim() && !file) return;
    onSendMessage(message, file || undefined);
    setMessage("");
    setFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {//enter key입력 메시지 전송
      e.preventDefault();
      handleSend();
    }
  };
  // 📄➕
  return (
    <div>
      {sendType === "application" ? (
        <div className="flex flex-col border-t p-2 bottom-1 ">
          {/* 파일 미리보기 */}
          {file && (
            <div className="relative w-40 mb-2 pb-20">
              {/* 이미지 파일 미리보기 */}
              {file.type === "image" && (
                <img
                  src={file.url}
                  alt="이미지 미리보기"
                  className="w-full h-32 object-cover rounded-md shadow-md"
                />
              )}
              {/* 비디오 파일 미리보기 */}
              {file.type === "video" && (
                <video controls className="w-full h-32 rounded-md shadow-md">
                  <source src={file.url} type="video/mp4" />
                  브라우저가 비디오 태그를 지원하지 않습니다.
                </video>
              )}
              {/* 파일 미리보기 */}
              {file.type === "application" && (
                <div className="p-3.5 ml-1 mr-1 border rounded-md text-sm bg-secondary-light">
                  📄 {file.name}
                </div>
              )}
  
              {/* 파일 삭제 버튼 */}
              <button
                onClick={() => setFile(null)}
                className="absolute top-1 right-1 hover:bg-secondary-light font-bold bg-secondary-light text-secondary-dark text-xs px-2 py-1 rounded-full"
              >
                X
              </button>
            </div>
          )}
          
          {/* 메시지 입력 및 전송 영역 */}
          <div className="sticky bottom-0 left-0 right-0 w-full border-t"></div>
          <div className="flex items-center fixed bottom-0 left-0 right-0 bg-white shadow-md pb-5 pt-3 border-t border-primary-200 dark:border-border-dark">
            {/* 파일 선택 버튼 */}
            <label
              htmlFor="file-upload"
              className="p-2 rounded-full hover:bg-primary-light w-7 h-7 flex items-center justify-center cursor-pointer"
            >
              ➕
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*, video/*, .pdf, .docx, .txt"
              onChange={handleFileChange}
            />
  
            {/* 메시지 입력창 */}
            <input
              type="text"
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="flex-1 ml-2 mr-3 p-2 border rounded-full"
              placeholder="메시지를 입력하세요..."
            />
  
            {/* 전송 버튼 */}
            <button
              onClick={handleSend}
              className="bg-primary-light hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
            >
              전송
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col border-t p-2 bottom-1">
          {/* 메시지 입력 및 전송 영역 */}
          <div className="sticky bottom-0 left-0 right-0 w-full"></div>
          <div className="flex items-center fixed bottom-0 left-0 right-0 bg-white shadow-md p-7 border-t border-primary-200 dark:border-border-dark">
            {/* 메시지 입력창 */}
            <input
              type="text"
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="flex-1 ml-2 mr-3 p-2 border rounded-full"
              placeholder="메시지를 입력하세요..."
            />
  
            {/* 전송 버튼 */}
            <button
              onClick={handleSend}
              className="bg-primary-light hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;