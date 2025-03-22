import { useState } from "react";
import ImageUpload from "../../components/features/upload/ImageUpload";
import { fileUpload } from "../../services/api/cloudAPI";
import CardDetails from "./CardDetails";

interface OCRResult {
  status: string;
  data: {
    message: string;
    response: any;
  };
  code: string;
}

const OCRUpload = () => {
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  const handleOCRUpload = async (formData: FormData) => {
    try {
      const result = await fileUpload.CloudOCR(formData);
      console.log("OCR 결과:", result);
      setOcrResult(result);
    } catch (error) {
      console.error("OCR 처리 중 오류:", error);
      setOcrResult(null);
    }
  };



  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 p-10">사진으로 카드 추가</h2>

      {/* OCR 촬영 이미지 업로드 */}
      <ImageUpload
        onUpload={handleOCRUpload}
        className="max-w-md mx-auto"
        type="ocr"
        borderStyle="border-2 border-dashed border-primary-500 rounded-lg dark:border-primary-500"
      />

      {/* OCR 선택 이미지 업로드 */}
      <ImageUpload
        onUpload={handleOCRUpload}
        className="max-w-md mx-auto mt-2 "
        type="image"
        borderStyle="border-2 border-dashed border-primary-500 rounded-lg dark:border-primary-500"
      />

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
      {/* OCR 결과를 CardDetails에 전달 */}
      {ocrResult && <CardDetails ocrResult={ocrResult} />}
    </div>

  );
};

export default OCRUpload;
