import { useNavigate } from "react-router-dom";
import OCRUpload from "./OCRUpload";
interface Card {
  id: number;
  name: string;
  number: string;
}

const RegisteredCardList = () => {
  const navigate = useNavigate();

  const handleCardClick = (cardInfo: Card) => {
    navigate(`/card-details/${cardInfo.id}`);
  };

  return (
    
    <div className="mt-5">
      <OCRUpload/>
      <h2 className="text-xl font-bold mb-2">등록된 카드</h2>

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
            카드
          </div>
          <span className="text-lg font-semibold">신용카드</span>
        </div>
      </div>
      
    </div>
  );
};

export default RegisteredCardList;
