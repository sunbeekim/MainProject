import { useState, memo } from 'react';
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
  useProductImage,
  extractImageIdFromPath
} from '../../services/api/productAPI';

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

  if (!thumbnailPath) return <div>이미지 없음</div>;
  if (isLoading) return <div>로딩중...</div>;
  if (error || !imageBlob) {
    // 이미지 ID를 사용하여 고유한 랜덤 이미지 생성
    const mockImageUrl = `https://picsum.photos/600/400?random=${
      imageId || Math.floor(Math.random() * 1000)
    }`;
    return <img src={mockImageUrl} alt="상품 이미지" className="w-full h-full object-cover" />;
  }

  return (
    <img
      src={URL.createObjectURL(imageBlob)}
      alt="상품 이미지"
      className="w-full h-full object-cover"
    />
  );
});

const MarketList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 최신 상품 Query
  const { data: latestProducts = [], isLoading: isLatestLoading } = useQuery<IProduct[]>({
    queryKey: ['latestProducts', selectedCategory],
    queryFn: async () => {
      try {
        const response = await getProducts();
        if (!response.data || response.data.length === 0) {
          const mockResponse = await mockAPI.market.getLatestProducts();
          return mockResponse.data.products.map(convertMockToProduct);
        }
        return response.data || [];
      } catch (error) {
        console.error('API 요청 실패:', error);
        const mockResponse = await mockAPI.market.getLatestProducts();
        return mockResponse.data.products.map(convertMockToProduct);
      }
    },
    gcTime: 600000,
    staleTime: 300000
  });

  const handleNavigateToProductRegister = () => {
    navigate('/product/register');
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === 0 ? null : categoryId);
  };

  const handleProductClick = (product: IProduct) => {
    navigate('/product-details', {
      state: {
        productData: {
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

  if (isLatestLoading) {
    return <div className="container mx-auto px-4 py-6">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Category categorySize="md" onCategorySelect={handleCategorySelect} />

      {/* 최신 상품 */}
      <div className="mt-4">
        <div className="no-scrollbar md:scrollbar-thin md:scrollbar-thumb-gray-400 md:scrollbar-track-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10">
            {latestProducts.map((product: IProduct) => (
              <div key={product.id} className="w-full flex-shrink-0 ">
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
