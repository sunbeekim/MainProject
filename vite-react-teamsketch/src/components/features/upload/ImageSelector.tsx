import React from 'react';

interface ImageSelectorProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onFileSelect, className = '' }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-primary rounded-lg hover:bg-primary-lightest transition-colors"
      >
        <div className="text-center ">
          <svg
            className="w-8 h-8 mx-auto text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="mt-2 block text-sm font-medium">이미지 선택</span>
        </div>
      </label>
    </div>
  );
};

export default ImageSelector;
