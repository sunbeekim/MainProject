
import PDLayout from '../components/layout/PDLayout';

const TestProductDetails = () => {
  // 테스트용 더미 데이터
  const productData = {
    images: [
      'https://via.placeholder.com/800x600/3498db/ffffff?text=운동+이미지+1',
      'https://via.placeholder.com/800x600/e74c3c/ffffff?text=운동+이미지+2',
      'https://via.placeholder.com/800x600/2ecc71/ffffff?text=운동+이미지+3'
    ],
    mainCategory: '운동',
    subCategory: '헬스',
    dopamine: 85,
    number: 1234,
    description: `안녕하세요! 함께 운동할 친구를 찾고 있습니다.

운동 초보자도 환영합니다! 
서로 도와가며 즐겁게 운동해요.

준비물:
- 운동복
- 실내 운동화
- 수건
- 물통

함께 건강한 습관을 만들어봐요! 💪`,
    maxParticipants: 6,
    currentParticipants: 3,
    startDate: '2025-03-01',
    endDate: '2025-03-03',
    location: '서울특별시 강남구 테헤란로 123 헬스장 B1층'
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
      subTitle='등록'
    />
  );
};

export default TestProductDetails;
