import React from "react";
import { useState } from "react";

interface MessageInputProps {
    onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <div className="bg-white p-4 border-t flex items-center gap-2">
            <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        className="flex-1 p-2 border rounded-lg"
        placeholder="메시지 입력..."
            />
            <button
                onClick={handleSendMessage}
                className="bg-[#FBCCC5] hover:bg-[#F9B0BA] text-white px-4 py-2 rounded-lg">전송</button>
            </div>
    );
};
export default MessageInput;