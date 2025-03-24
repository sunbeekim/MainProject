import { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FloatingButton from '../../components/common/FloatingButton';
import Category from '../../components/common/CategoryIcon';
import { mockAPI } from '../../mock/mockAPI';
import { IProduct as IMockProduct } from '../../mock/mockData';
import { IProduct } from '../../types/product';
import Card from '../../components/features/card/Card';
import {
  getProducts,
  getProductsByCategory,
  useProductImage,
  extractImageIdFromPath
} from '../../services/api/productAPI';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';


import { nearbyProdListApi } from '../../services/api/authAPI';
// import { setProducts } from '../../store/slices/productSlice';

// mock 데이터를 실제 API 응답 타입으로 변환하는 함수
const convertMockToProduct = (mockProduct: IMockProduct): IProduct => ({
  id: mockProduct.id,
  productCode: `MOCK-${mockProduct.id}`,
  title: mockProduct.title,
  description: mockProduct.description,
  price: mockProduct.price,
  email: 'mock@example.com',
  categoryId: 1, // 기본 카테고리 ID
  hobbyId: 1, // 기본 취미 ID
  transactionType: '대면',
  registrationType: '판매',
  maxParticipants: mockProduct.maxParticipants,
  currentParticipants: mockProduct.currentParticipants,
  days: [],
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  latitude: null,
  longitude: null,
  meetingPlace: mockProduct.location,
  address: mockProduct.location,
  createdAt: mockProduct.createdAt,
  imagePaths: [mockProduct.image],
  thumbnailPath: mockProduct.image,
  nickname: 'Mock User',
  bio: null,
  dopamine: mockProduct.dopamine,
  visible: true
});

const ProductImage = memo(({ thumbnailPath }: { thumbnailPath: string | null }) => {
  const imageId = thumbnailPath ? extractImageIdFromPath(thumbnailPath) : null;
  const { data: imageBlob, isLoading, error } = useProductImage(imageId || 0);
  const [imgError, setImgError] = useState(false);

  // 이미지가 없는 경우 기본 이미지 표시
  if (!thumbnailPath) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-gray-400">이미지 없음</span>
      </div>
    );
  }

  // 로딩 중인 경우 로딩 컴포넌트 표시
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  // 에러가 발생했거나 이미지 로드에 실패한 경우 대체 이미지 표시
  if (error || !imageBlob || imgError) {
    // 이미지 ID를 사용하여 고유한 랜덤 이미지 생성
    const mockImageUrl = `https://picsum.photos/600/400?random=${imageId || Math.floor(Math.random() * 1000)
      }`;
    return (
      <img
        src={mockImageUrl}
        alt="상품 이미지"
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  // 정상적으로 이미지 표시
  return (
    <img
      src={URL.createObjectURL(imageBlob)}
      alt="상품 이미지"
      className="w-full h-full object-cover"
      onError={() => setImgError(true)}
    />
  );
});

export interface NProductResponse {
  status: string;
  message: string;
  data:
  IProduct[];
}

const MarketList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string>('전체');
  const [isPageLoading, setIsPageLoading] = useState(true);



  // 상품 Query - 카테고리 선택에 따라 다른 API 호출
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      try {
        let response;

        // 카테고리가 선택되었으면 카테고리별 조회, 아니면 전체 조회
        if (selectedCategory) {
          response = await getProductsByCategory(selectedCategory);
        } else {
          response = await getProducts();
        }
        console.log('response', response);
        // 응답 데이터가 없으면 목 데이터 사용
        if (!response.data || response.data.length === 0) {
          // 카테고리가 선택된 경우 해당 카테고리의 목 데이터만 필터링
          if (selectedCategory) {
            const mockResponse = await mockAPI.market.getProductsByCategory(categoryName);
            return mockResponse.data.products.map(convertMockToProduct);
          } else {
            const mockResponse = await mockAPI.market.getLatestProducts();
            return mockResponse.data.products.map(convertMockToProduct);
          }
        }

        return response.data || [];
      } catch (error) {
        console.error('API 요청 실패:', error);
        // 에러 발생 시 한 번만 토스트 메시지 표시
        toast.error('상품 목록을 불러오는 중 오류가 발생했습니다.');

        // 에러 발생 시 목 데이터 사용
        if (selectedCategory) {
          const mockResponse = await mockAPI.market.getProductsByCategory(categoryName);
          return mockResponse.data.products.map(convertMockToProduct);
        } else {
          const mockResponse = await mockAPI.market.getLatestProducts();
          return mockResponse.data.products.map(convertMockToProduct);
        }
      }
    },
    gcTime: 60000,
    staleTime: 30000
  });

  // 페이지 로딩 상태 관리
  useEffect(() => {
    if (!isLoading) {
      // 데이터 로딩이 완료되면 약간의 지연 후 로딩 상태 해제
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500); // 500ms 지연으로 모든 요소가 렌더링될 시간을 줍니다

      return () => clearTimeout(timer);
    }
  }, [isLoading]);





  // 에러 처리
  useEffect(() => {
    if (error) {
      toast.error('상품 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }, [error]);

  const handleNavigateToProductRegister = () => {
    navigate('/product/register');
  };

  const handleCategorySelect = (categoryId: number, name: string) => {
    setSelectedCategory(categoryId === 0 ? null : categoryId);
    setCategoryName(name);
    setIsPageLoading(true); // 카테고리 변경 시 로딩 상태로 변경
    console.log(`카테고리 선택: ${name} (ID: ${categoryId})`);
  };

  const handleProductClick = (product: IProduct) => {
    navigate('/product-details', {
      state: {
        productData: {
          productCode: product.productCode,
          images: product.imagePaths || [],
          dopamine: product.dopamine,
          id: product.id,
          email: product.email,
          nickname: product.nickname || '',
          thumbnailPath: product.thumbnailPath || '',
          registrationType: product.registrationType,
          transactionType: product.transactionType,
          meetingPlace: product.meetingPlace || '',
          description: product.description,
          maxParticipants: product.maxParticipants,
          currentParticipants: product.currentParticipants,
          address: product.address || '',
          startDate: product.startDate,
          endDate: product.endDate,
          title: product.title,
          price: product.price,
          categoryId: product.categoryId,
          hobbyId: product.hobbyId,
          latitude: product.latitude || 0,
          longitude: product.longitude || 0,
          days: product.days || []
        }
      }
    });
  };

  if (isPageLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loading />
        <p className="mt-4 text-gray-600">상품 목록을 불러오는 중입니다...</p>
      </div>
    );
  }

  const fetchNearbyProducts = async () => {
    const latitude = 37.7749;
    const longitude = -122.4194;
    const distance = 10;

    try {
      const result = await nearbyProdListApi({ latitude, longitude, distance });
      console.log(result);
    } catch (error) {
      console.error('Error fetching nearby products:', error);
    }
  };

  fetchNearbyProducts();

  // const fetchNearbyProducts = async (distance: number) => {
  //   try {
  //     const response: NProductResponse = await nearbyProdListApi({ latitude: myLocation.lat, longitude: myLocation.lng, distance });
  //     if (response.status === 'success') {
  //       setProducts(response.data);
  //     } else {
  //       toast.error("주변 상품을 가져오는 데 실패했습니다.");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("상품 목록을 가져오는 중 오류가 발생했습니다.");
  //   }
  // };

  return (
    <div className="w-full mt-4">

      <Category categorySize="md" onCategorySelect={handleCategorySelect} />

      {/* 상품 목록 */}
      <div className="mt-4 px-4">
        <h2 className="text-lg font-semibold mb-3">{categoryName} 상품</h2>
        <div className="no-scrollbar md:scrollbar-thin md:scrollbar-thumb-gray-400 md:scrollbar-track-gray-100">
          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              해당 카테고리에 상품이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 mb-8">
              {products.map((product: IProduct) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <Card
                    title={product.title}
                    description={product.description}
                    image={<ProductImage thumbnailPath={product.thumbnailPath} />}
                    price={product.price.toString()}
                    dopamine={product.dopamine}
                    currentParticipants={product.currentParticipants}
                    maxParticipants={product.maxParticipants}
                    location={product.address || product.meetingPlace || ''}
                    onClick={() => handleProductClick(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingButton
        onClick={handleNavigateToProductRegister}
        icon={<span style={{ fontSize: '2rem' }}>+</span>}
        label="상품 등록"
        position="bottom-right"
        color="primary"
      />
    </div>
  );
};

export default MarketList;
