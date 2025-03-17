import { useNavigate } from "react-router-dom";


const CSList = () => {
    const navigate = useNavigate();


    const handleBackClick =()=> {
        navigate(-1); 
    }

    const handleChatClick = () => {
        navigate('/servicechat');
    }

    const hadleInquiryHistory = () => {
        navigate('/inquiry-history');
    }

    return (
            <div className="flex flex-col">
      <div className="bg-primary-500 p-1 flex items-center justify-between sticky top-0 z-10 w-full">
        <button onClick={handleBackClick} className="text-white text-xl font-semibold">
          &#8592;
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
          고객 센터
        </h1>
            </div>

            <div className="flex flex-col gap-5 mt-8 p-4">
            <button onClick={handleChatClick} className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-4 text-lg font-semibold rounded-lg shadow-md active:from-violet-700 active:to-purple-700 hover:from-violet-700 hover:to-purple-700 transition-all">챗봇 상담</button>

            <button onClick={hadleInquiryHistory} className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-4 text-lg font-semibold rounded-lg shadow-md active:from-violet-700 active:to-purple-700 hover:from-violet-700 hover:to-purple-700 transition-all">문의 내역</button>

            </div>
        </div>

    );
}

export default CSList;