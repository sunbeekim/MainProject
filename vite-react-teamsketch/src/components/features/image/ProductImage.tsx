import { memo } from 'react';
import { useProductImage, extractImageIdFromPath } from '../../../services/api/productAPI';

const ProductImage = memo(({ imagePath }: { imagePath: string }) => {
  const imageId = imagePath ? extractImageIdFromPath(imagePath) : null;
  const { data: imageBlob, isLoading } = useProductImage(imageId || 0);
  
  if (!imagePath) return <div>이미지 없음</div>;
  if (isLoading) return <div>로딩중...</div>;
  if (!imageBlob) return <div>이미지 없음</div>;

  return (
    <img 
      src={URL.createObjectURL(imageBlob)} 
      alt="상품 이미지"
      className="w-full h-full object-cover"
    />
  );
});

export default ProductImage; 