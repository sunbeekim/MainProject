import { useLocation } from 'react-router-dom';
import PDLayout from '../../components/layout/PDLayout';
import LocationLayout from '../../components/layout/LocationLayout';
import OpenMap from '../../components/features/location/OpenMap';
import LocationInfo from '../../components/features/location/LocationInfo';
import { useDispatch } from 'react-redux';
import { setEndLocation } from '../../store/slices/mapSlice';
import { useAppSelector } from '../../store/hooks';
import { useEffect } from 'react';

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { constantCategories, constantHobbies } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(
      setEndLocation({
        lat: location.state.productData.latitude,
        lng: location.state.productData.longitude,
        address: location.state.productData.address,
        meetingPlace: location.state.productData.meetingPlace
      })
    );
    console.log('location.state.productData', location.state.productData);
  }, [dispatch, location.state.productData]);

  const productData = location.state?.productData || {
    id: 1,
    images: ['https://picsum.photos/600/400?random=1'],
    productCode: ``,
    title: 'mockProduct.title',
    description: 'mockProduct.description',
    price: 'mockProduct.price',
    email: 'mock@example.com',
    categoryId: 1, // 기본 카테고리 ID
    hobbyId: 1, // 기본 취미 ID
    transactionType: '대면',
    registrationType: '판매',
    maxParticipants: 1,
    currentParticipants: 0,
    days: [],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    latitude: null,
    longitude: null,
    meetingPlace: 'mockProduct.location',
    address: 'mockProduct.location',
    createdAt: 'mockProduct.createdAt',
    imagePaths: ['mockProduct.image'],
    thumbnailPath: 'mockProduct.image',
    nickname: 'Mock User',
    dopamine: 1,
    visible: true
  };

  // categoryId를 사용하여 카테고리 이름 찾기
  const mainCategory =
    constantCategories.find((category) => category.categoryId === productData.categoryId)
      ?.categoryName || '카테고리 없음';

  // hobbyId를 사용하여 취미 이름 찾기
  const subCategory =
    constantHobbies.find((hobby) => hobby.hobbyId === productData.hobbyId)?.hobbyName ||
    '취미 없음';

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
  const processedImages = productData.images.map((imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    console.log('imagePath', imagePath);
    return `${import.meta.env.VITE_API_URL}/api/core/market/images${imagePath}`;
  });

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
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
      title={productData.title}
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
      meetingPlace={productData.meetingPlace}
      btName={'신청'}
      price={formatPrice(productData.price)}
      transactionType={productData.transactionType}
      email={productData.email}
      nickname={productData.nickname || '닉x'}
      day={productData.days || []}
      map={
        <LocationLayout
          childrenCenter={<OpenMap nonClickable={true} />}
          childrenBottom={<LocationInfo showEndLocation={true} />}
        ></LocationLayout>
      }
    />
  );
};

export default ProductDetails;
