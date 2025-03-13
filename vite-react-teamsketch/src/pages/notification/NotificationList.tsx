import { useState } from "react";
import Button from "../../components/common/Button"; 

const NotificationList = () => {
  const [filter, setFilter] = useState("전체");

  const notifications = [
    { id: 1, message: "새로운 거래 요청이 있습니다.", type: "거래", createdAt: "2025-03-09", status: "UNREAD" },
    { id: 2, message: "새로운 채팅 메시지가 도착했습니다.", type: "채팅", createdAt: "2025-03-08", status: "READ" },
    { id: 3, message: "게시판 댓글이 달렸습니다.", type: "게시판", createdAt: "2025-03-07", status: "UNREAD" },
  ];

  // 선택된 필터에 따라 알림 목록 필터링
  const filteredNotifications = notifications.filter((n) => filter === "전체" || n.type === filter);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* 알림 유형 필터 */}
      <div className="flex space-x-2 justify-center items-center bg-white dark:bg-gray-800 shadow-md z-10 p-4">
        {["전체", "거래", "채팅", "게시판"].map((type) => (
          <Button
            key={type}
            variant={filter === type ? "primary" : "outline"}
            size="md"
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              filter === type 
                ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600' 
                : 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-600'
            }`}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* 읽지 않은 알림 카운터 */}
      <div className="bg-white dark:bg-gray-800 px-6 py-3 shadow-sm">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
          읽지 않은 알림: {notifications.filter((n) => n.status === "UNREAD").length}개
        </span>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <ul className="space-y-3 pb-16">
          {filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`
                p-4 rounded-xl transition-all duration-300
                ${notification.status === "UNREAD" 
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 shadow-md' 
                  : 'bg-white dark:bg-gray-800 shadow-sm'}
                border border-primary-100 dark:border-gray-700
                hover:shadow-lg hover:scale-[1.01] transform
              `}
            >
              <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                {notification.message}
              </p>
              <div className="flex justify-between items-center">
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${notification.status === "UNREAD" 
                    ? 'bg-primary-200 dark:bg-primary-900 text-primary-700 dark:text-primary-200' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
                `}>
                  {notification.type}
                </span>
                <small className="text-gray-500 dark:text-gray-400">
                  {notification.createdAt}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationList;
