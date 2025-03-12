import { useNavigate } from "react-router-dom"; // React Router v6에서 useNavigate 사용
import ImageUpload from "../../components/features/upload/ImageUpload";
import { fileUpload } from "../../services/api/cloudAPI";
import { useState } from "react";


interface Card {
  id: number;
  name: string;
  number: string;
}

interface OCRResult {
  status: string;
  data: {
    message: string;
    response: any; // OCR 응답 데이터의 실제 타입에 맞게 수정할 수 있습니다
  };
  code: string;
}

const RegisteredCard = () => {
  const navigate = useNavigate(); 

  const handleCardClick = (cardInfo: Card) => {
    navigate(`/card-details/${cardInfo.id}`); // 상세 페이지로 이동
  };

  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  const handleOCRUpload = async (formData: FormData) => {
    try {
      const result = await fileUpload.CloudOCR(formData);
      console.log('OCR 결과:', result);
      setOcrResult(result);
    } catch (error) {
      console.error('OCR 처리 중 오류:', error);
      setOcrResult(null);
    }
  };
  
  return (
    <div className="p-4 m-4">
      <h2 className="text-xl font-semibold mb-2">결제 카드 추가</h2>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">OCR 이미지 업로드 테스트</h2>
        <ImageUpload onUpload={handleOCRUpload} className="max-w-md mx-auto" type="image" />
        
        {/* OCR 결과 표시 */}
        {ocrResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">OCR 결과:</h3>
            <div className="whitespace-pre-wrap break-words">
              <p>상태: {ocrResult.status}</p>
              <p>메시지: {ocrResult.data.message}</p>
              <p>응답 데이터:</p>
              <pre className="bg-white p-2 rounded mt-2 overflow-x-auto">
                {JSON.stringify(ocrResult.data.response, null, 2)}
              </pre>
            </div>
          </div>
        )}
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
