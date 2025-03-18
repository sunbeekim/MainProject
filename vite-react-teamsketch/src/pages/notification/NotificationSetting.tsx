import { useNavigate } from "react-router-dom";
import AlarmToggle from "./AlarmToggle";

const NotificationSetting = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <div className="flex flex-col">
            {/* 헤더 */}
            <div className="bg-primary-500 p-1 flex items-center justify-between sticky top-0 z-10 w-full mb-3">
                <button onClick={handleBackClick} className="text-white text-xl font-semibold">
                    &#8592;
                </button>
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
                    알림 설정
                </h1>
            </div>

            {/* 거래 알림 항목 */}
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 p-3 mb-3 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                <div>
                    <span className="font-semibold">거래알림</span>
                    <div className="self-stretch text-center text-[#71727a] text-xs font-normal font-['Inter'] leading-none tracking-tight mt-1">
                        상품 요청, 승인 등
                    </div>
                </div>
                <AlarmToggle />
            </div>

            {/* 채팅 알림 항목 */}
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 p-3 mb-3 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                <div>
                    <span className="font-semibold">채팅알림</span>
                    <div className="self-stretch text-center text-[#71727a] text-xs font-normal font-['Inter'] leading-none tracking-tight mt-1">
                        새로운 메시지 알림
                    </div>
                </div>
                <AlarmToggle />
            </div>

            {/* 게시판 알림 항목 */}
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 p-3 mb-2 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                <div>
                    <span className="font-semibold">게시판알림</span>
                    <div className="self-stretch text-center text-[#71727a] text-xs font-normal font-['Inter'] leading-none tracking-tight mt-1">
                        새 글 작성, 댓글 등
                    </div>
                </div>
                <AlarmToggle />
            </div>
        </div>
    );
}

export default NotificationSetting;
