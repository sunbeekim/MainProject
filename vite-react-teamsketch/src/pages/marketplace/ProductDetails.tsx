import { useLocation } from 'react-router-dom';
import PDLayout from '../../components/layout/PDLayout';

const ProductDetails = () => {
  const location = useLocation();
  const productData = location.state?.productData || {
    // 기본값 설정 (데이터가 없을 경우를 대비)
    images: [
      'https://via.placeholder.com/800x600/3498db/ffffff?text=기본+이미지'
    ],
    mainCategory: '',
    subCategory: '',
    dopamine: 0,
    number: 0,
    description: '상품 설명이 없습니다.',
    maxParticipants: 0,
    currentParticipants: 0,
    startDate: '',
    endDate: '',
    location: '위치 정보가 없습니다.',
    title: '상품명이 없습니다.',
    price: 0
  };

  return (
    <PDLayout
      images={productData.images}
      mainCategory={productData.mainCategory}
      subCategory={productData.subCategory}
      dopamine={productData.dopamine}
      number={productData.number}
      description={productData.description}
      maxParticipants={productData.maxParticipants}
      currentParticipants={productData.currentParticipants}
      startDate={productData.startDate}
      endDate={productData.endDate}
      location={productData.location}
      subTitle={productData.title}
    />
  );
};

export default ProductDetails;
