import { useLocation } from 'react-router-dom';
import PDLayout from '../../components/layout/PDLayout';
import LocationLayout from '../../components/layout/LocationLayout';
import OpenMap from '../../components/features/location/OpenMap';
import LocationInfo from '../../components/features/location/LocationInfo';
import { useDispatch } from 'react-redux';
import { setEndLocation } from '../../store/slices/mapSlice';
import { useAppSelector } from '../../store/hooks';

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { constantCategories, constantHobbies } = useAppSelector((state) => state.category);
  dispatch(setEndLocation({
    lat: location.state.productData.latitude,
    lng: location.state.productData.longitude,
    address: location.state.productData.address,
    meetingPlace: location.state.productData.meetingPlace
  }));

  const productData = location.state?.productData || {
    images: ['https://via.placeholder.com/800x600/3498db/ffffff?text=기본+이미지'],
    dopamine: 0,
    id: 0,
    email: '',
    nickname: '',
    description: '상품 설명이 없습니다.',
    maxParticipants: 0,
    currentParticipants: 0,
    startDate: '',
    endDate: '',
    meetingPlace: '',
    address: '',
    title: '상품명이 없습니다.',
    price: '',
    categoryId: 0,
    hobbyId: 0,
    latitude: 0,
    longitude: 0,
    registrationType: '',
    transactionType: '',
    thumbnailPath: ''
  };

  // categoryId를 사용하여 카테고리 이름 찾기
  const mainCategory = constantCategories.find(
    (category) => category.categoryId === productData.categoryId
  )?.categoryName || '카테고리 없음';

  // hobbyId를 사용하여 취미 이름 찾기
  const subCategory = constantHobbies.find(
    (hobby) => hobby.hobbyId === productData.hobbyId
  )?.hobbyName || '취미 없음';

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`;
  };

  // 이미지 URL 처리
  const processedImages = productData.images.map((imagePath: string) =>
    imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_API_URL}/api/core/market/images${imagePath}`
  );

  // 가격 포맷팅 함수
  const formatPrice = (price: string) => {
    return price;
  };

  // 거래 유형 포맷팅
  const formatTransactionType = (type: string) => {
    const types = {
      대면: '🤝 대면',
      비대면: '💻 비대면',
      구매: '💰 구매',
      판매: '🏷️ 판매'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <PDLayout
      images={processedImages}
      category={`${formatTransactionType(productData.registrationType)} | ${mainCategory}`}
      hobby={subCategory}
      dopamine={productData.dopamine}
      id={productData.id}
      description={productData.description}
      maxParticipants={productData.maxParticipants}
      currentParticipants={productData.currentParticipants}
      startDate={formatDate(productData.startDate)}
      endDate={formatDate(productData.endDate)}
      meetingPlace={`${productData.meetingPlace} (${productData.address})`}
      btName={"신청"}
      price={formatPrice(productData.price)}
      transactionType={formatTransactionType(productData.transactionType)}
      email={productData.email}
      nickname={productData.nickname || '닉x'}
      map={<LocationLayout           
        childrenCenter={<OpenMap nonClickable={true}/>}
        childrenBottom={
            <LocationInfo             
                showEndLocation={true}                                   
            />}                
    ></LocationLayout> }
    />
  );
};

export default ProductDetails;
