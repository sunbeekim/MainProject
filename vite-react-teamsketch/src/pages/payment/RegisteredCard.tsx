import { useNavigate } from "react-router-dom";



const RegisteredCardList = () => {
  const navigate = useNavigate();

  
  const handleaddcard = () => {
    navigate('/ocr-upload');
  }
  
  const handleDeletecard = () => {
  
    navigate('/delete-modal');
  };


  return (
    
    <div className="mt-5">
      
      <h2 className="text-xl font-bold mb-2">등록된 카드</h2>

      <div className="space-y-4">
        <div
          className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer"
        >
          
          <div className="w-20 h-12 bg-gray-300 rounded-md flex items-center justify-center">
            카드
          </div>
          <span className="text-lg font-semibold">체크카드</span>
          <button onClick={handleDeletecard} className="ml-auto rounded">삭제</button>
        </div>

        <div className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-20 h-12 bg-gray-300 rounded-md flex items-center justify-center">
            카드
          </div>
          <span className="text-lg font-semibold">신용카드</span>
        </div>
        <button onClick={handleDeletecard} className="ml-auto rounded">삭제</button>
      </div>

        <div
          className="flex items-center justify-center gap-4 bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer">          
          <span onClick={handleaddcard} className="text-lg font-semibold">➕ 카드 등록하기</span>
          </div>
      </div>
      
    </div>
  );
};

export default RegisteredCardList;
