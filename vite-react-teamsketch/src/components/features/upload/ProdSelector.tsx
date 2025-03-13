import React from 'react';

interface ImageSelectorProps {
  onFileSelect: (file: File) => void;
  className?: string;
  text?: string;
}

const ProdSelector: React.FC<ImageSelectorProps> = ({
  onFileSelect,
  className = '',
  text = '상품 사진 등록'
}) => {
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
        id="prod-upload"
      />
      <label
        htmlFor="prod-upload"
        className="cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-primary rounded-lg hover:bg-primary-lightest transition-colors"
      >
        {text}
      </label>
    </div>
  );
};

export default ProdSelector;
