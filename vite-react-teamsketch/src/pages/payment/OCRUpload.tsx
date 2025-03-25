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
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">사진으로 카드 추가</h2>
        <p className="text-gray-600">카드 사진을 촬영하거나 선택하여 정보를 자동으로 입력하세요</p>
      </div>

      <div className="grid gap-6">
        {/* OCR 촬영 이미지 업로드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카드 촬영</h3>
          <ImageUpload
            onUpload={handleOCRUpload}
            type="ocr"
            borderStyle="border-2 border-dashed border-primary-500 rounded-xl hover:border-primary-600 transition-colors duration-200"
          />
        </div>

        {/* OCR 선택 이미지 업로드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">이미지 선택</h3>
          <ImageUpload
            onUpload={handleOCRUpload}
            type="image"
            borderStyle="border-2 border-dashed border-primary-500 rounded-xl hover:border-primary-600 transition-colors duration-200"
          />
        </div>

        {/* OCR 결과 표시 */}
        {ocrResult && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">OCR 결과</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  ocrResult.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  {ocrResult.status === 'success' ? '성공' : '실패'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{ocrResult.data.message}</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {JSON.stringify(ocrResult.data.response, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OCR 결과를 CardDetails에 전달 */}
      {ocrResult && (
        <div className="mt-8">
          <CardDetails ocrResult={ocrResult} />
        </div>
      )}
    </div>
  );
};

export default OCRUpload;
