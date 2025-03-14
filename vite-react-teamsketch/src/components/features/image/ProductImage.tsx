import { memo } from 'react';
import { useProductImage, extractImageIdFromPath } from '../../../services/api/productAPI';

const ProductImage = memo(({ imagePath }: { imagePath: string }) => {
  const imageId = imagePath ? extractImageIdFromPath(imagePath) : null;
  const { data: imageBlob, isLoading } = useProductImage(imageId || 0);
  
  if (!imagePath) return <div>이미지 없음</div>;
  if (isLoading) return <div>로딩중...</div>;
  
  // 이미지 로드 실패 시 대체 이미지 표시
  if (!imageBlob) {
    // 이미지 ID를 사용하여 고유한 랜덤 이미지 생성
    const fallbackImageUrl = `https://picsum.photos/600/400?random=${imageId || Math.floor(Math.random() * 1000)}`;
    return (
      <img 
        src={fallbackImageUrl} 
        alt="상품 이미지"
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <img 
      src={URL.createObjectURL(imageBlob)} 
      alt="상품 이미지"
      className="w-full h-full object-cover"
    />
  );
});

export default ProductImage; 