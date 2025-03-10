import { useState } from "react";
import Button from "../../components/common/Button"; 
import { useNavigate } from "react-router-dom";

const NotificationList = () => {
  const [filter, setFilter] = useState("전체");
  const navigate = useNavigate();

  const notifications = [
    { id: 1, message: "새로운 거래 요청이 있습니다.", type: "거래", createdAt: "2025-03-09", status: "UNREAD" },
    { id: 2, message: "새로운 채팅 메시지가 도착했습니다.", type: "채팅", createdAt: "2025-03-08", status: "READ" },
    { id: 3, message: "게시판 댓글이 달렸습니다.", type: "게시판", createdAt: "2025-03-07", status: "UNREAD" },
  ];

  // 선택된 필터에 따라 알림 목록 필터링
  const filteredNotifications = notifications.filter((n) => filter === "전체" || n.type === filter);

  const handleBackClick = () => {
    navigate(-1); // 뒤로가기 버튼 클릭 시 이전 페이지로 이동
  };

  return (
    <div className="flex flex-col  h-screen">
    {/* 상단 헤더 (고정) */}
      <div className="bg-[#ECCEF5] p-1 flex items-center justify-between shadow-md sticky top-0 z-10 w-full">
         {/* 뒤로가기 버튼 */}
      <button onClick={handleBackClick} className="text-white text-xl font-semibold">
          &#8592;</button>
      
          <h1 className="absolute left-1/2 text-[#330019] transform -translate-x-1/2 text-lg font-semibold">알림</h1>
        </div>

      {/* 알림 유형 버튼 */}
      <div className="flex space-x-2 justify-center items-center sticky top-[52px] bg-white z-10 p-2">
        {["전체", "거래", "채팅", "게시판"].map((type) => (
          <Button
            key={type}
            variant={filter === type ? "secondary" : "outline"}
            size="md"
            onClick={() => setFilter(type)}
          >
            {type === "전체" ? "전체" : type}
          </Button>
        ))}
      </div>

      {/* 읽지 않은 알림 개수 */}
      <div className="ml-4 justify-center items-center font-semibold">
        읽지 않은 알림: {notifications.filter((n) => n.status === "UNREAD").length}개
      </div>

      {/* 알림 목록 */}
      <ul className="space-y-2 m-4 justify-center items-center font-semibold">
        {filteredNotifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-3 border-2 border-primary-light rounded-2xl ${notification.status === "UNREAD" ? "bg-secondary-light" : "bg-white"}`}>
            <p>{notification.message}</p>
            <small className="text-gray-500">{notification.createdAt}</small>
          </li>
        ))}
      </ul>
    </div>
    
  );
};

export default NotificationList;
