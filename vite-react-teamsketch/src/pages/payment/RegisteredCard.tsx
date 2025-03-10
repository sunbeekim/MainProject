import { useNavigate } from "react-router-dom"; // React Router v6에서 useNavigate 사용
import ImageUpload from "../../components/features/upload/ImageUpload";
import { fileUpload } from "../../services/api/testAPI";



interface Card {
  id: number;
  name: string;
  number: string;
}

const RegisteredCard = () => {
  const navigate = useNavigate(); 

  const handleCardClick = (cardInfo: Card) => {
    navigate(`/card-details/${cardInfo.id}`); // 상세 페이지로 이동
  };

  return (
    <div className="p-4 m-4">
      <h2 className="text-xl font-semibold mb-2">결제 카드 추가</h2>
      
      {/* 결제 카드 추가 */}
      <div className="border-2 border-dashed border-primary-light p-5 rounded-lg">
        <ImageUpload onUpload={fileUpload.CloudOCR} className="max-w-md mx-auto" type="ocr" />
      </div>

      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mt-5 mb-2">
        <h2 className="text-xl font-bold">등록된 카드</h2>
      </div>

      {/* 등록된 카드 리스트 */}
      <div className="space-y-4">
        <div
          className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer"
          onClick={() => handleCardClick({ id: 1, name: "체크카드", number: "1234 5678 9876 5432" })}
        >
          <div className="w-20 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          카드
          </div>
          <span className="text-lg font-semibold">체크카드</span>
        </div>

        <div
          className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer"
          onClick={() => handleCardClick({ id: 2, name: "신용카드", number: "1111 2222 3333 4444" })}
        >
          <div className="w-20 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          카드드
          </div>
          <span className="text-lg font-semibold">신용카드</span>
        </div>
      </div>
     
   </div>
  );
};

export default RegisteredCard;
