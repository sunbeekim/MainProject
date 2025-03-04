import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';

interface ProfileSelectorProps {
  onFileSelect?: (file: File) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isEditable?: boolean;
  file?: File;
  imageUrl?: string;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  onFileSelect,
  className = 'relative flex justify-center px-4',
  size = 'md',
  isEditable = true,
  file,
  imageUrl = 'https://picsum.photos/600/400?random=33'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl);

  // file prop이 변경될 때마다 previewUrl 업데이트
  useEffect(() => {
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      // cleanup 함수
      return () => {
        URL.revokeObjectURL(newPreviewUrl);
      };
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      onFileSelect?.(file);
    }
  };

  // 크기별 스타일 설정
  const sizeStyles = {
    sm: 'w-[20vw] h-[20vw] max-w-[120px] max-h-[120px] min-w-[80px] min-h-[80px]',
    md: 'w-[33vw] h-[33vw] max-w-[200px] max-h-[200px] min-w-[120px] min-h-[120px]',
    lg: 'w-[45vw] h-[45vw] max-w-[300px] max-h-[300px] min-w-[200px] min-h-[200px]'
  };

  return (
    <div className={className}>
      <div
        className={`
          ${sizeStyles[size]}
          rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden shadow-lg 
          relative cursor-pointer group
          ${isEditable ? 'cursor-pointer' : 'cursor-default'}
          transition-all duration-300 ease-in-out
          hover:shadow-xl
        `}
        onMouseEnter={() => isEditable && setIsHovered(true)}
        onMouseLeave={() => isEditable && setIsHovered(false)}
      >
        {/* 프로필 이미지 */}
        <img
          src={previewUrl}
          alt="프로필"
          className={`w-full h-full object-cover transition-all duration-300
            ${isHovered ? 'opacity-70 scale-105' : 'opacity-100 scale-100'}`}
        />

        {/* 수정 가능한 경우에만 오버레이와 입력 필드 표시 */}
        {isEditable && (
          <>
            {/* 수정 버튼 오버레이 */}
            <label
              className={`
                absolute inset-0 flex flex-col items-center justify-center
                bg-black bg-opacity-50 transition-all duration-300
                cursor-pointer backdrop-blur-sm
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div className="transform transition-transform duration-300 hover:scale-110">
                <FaCamera className="text-white text-2xl mb-2" />
                <span className="text-white text-sm font-medium">프로필 수정</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="프로필 이미지 업로드"
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;
