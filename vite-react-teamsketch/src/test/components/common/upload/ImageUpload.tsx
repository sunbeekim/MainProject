import React, { useState } from 'react';
import Button from '../button/Button';
import ImageSelector from './ImageSelector';
import CameraCapture from './CameraCapture';
// test
interface ImageUploadProps {
  onUpload: (formData: FormData) => Promise<any>;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, className = '' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await onUpload(formData);
    } catch (error) {
      console.error('업로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <ImageSelector onFileSelect={handleFileSelect} />
          <CameraCapture onCapture={handleFileSelect} />
        </div>

        {previewUrl && (
          <div className="relative">
            <img
              src={previewUrl}
              alt="미리보기"
              className="max-w-xs rounded-lg shadow-md"
            />
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {selectedFile && (
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? '업로드 중...' : '업로드'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;