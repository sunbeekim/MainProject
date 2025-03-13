import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FloatingButton from '../../components/common/FloatingButton';
import Category from '../../components/common/CategoryIcon';
import { mockAPI } from '../../mock/mockAPI';
import { IProduct } from '../../mock/mockData';
import Card from '../../components/features/card/Card';
import { IGetProduct } from '../../types/product';
import { getProducts } from '../../services/api/productAPI';

// 타입 정의 추가
type ProductType = IGetProduct | IProduct;

const MarketList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 최신 상품 Query
  const { data: latestProducts = [], isLoading: isLatestLoading } = useQuery<ProductType[]>({
    queryKey: ['latestProducts', selectedCategory],
    queryFn: async () => {
      try {
        const filter = selectedCategory ? { categoryId: selectedCategory } : undefined;
        const response = await getProducts(filter);
        console.log(response);
        if (response.length === 0) {
          console.log('상품이 없습니다.');
          const mockResponse = await mockAPI.market.getLatestProducts();
          return mockResponse.data.products;
        }
        return response || [];
      } catch (error) {
        console.error('API 요청 실패:', error);
        const mockResponse = await mockAPI.market.getLatestProducts();
        return mockResponse.data.products;
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

  const handleProductClick = (product: ProductType) => {
    navigate('/product-details', {
      state: {
        productData: {
          images:
            'imagePaths' in product && Array.isArray(product.imagePaths)
              ? product.imagePaths
              : ['image' in product ? product.image : ''],
          dopamine: 'dopamine' in product ? product.dopamine : 5,
          id: product.id,
          email: 'email' in product ? product.email : '',
          nickname: 'nickname' in product ? product.nickname : '',
          thumbnailPath: 'thumbnailPath' in product ? product.thumbnailPath : '',
          registrationType: 'registrationType' in product ? product.registrationType : '',
          transactionType: 'transactionType' in product ? product.transactionType : '',
          meetingPlace: 'meetingPlace' in product ? product.meetingPlace : '',
          description: product.description,
          maxParticipants: 'maxParticipants' in product ? product.maxParticipants : 0,
          currentParticipants: 'currentParticipants' in product ? product.currentParticipants : 0,
          address: 'address' in product ? product.address : '',
          startDate: 'startDate' in product ? product.startDate : '',
          endDate: 'endDate' in product ? product.endDate : '',
          title: product.title,
          price: product.price,
          categoryId: 'categoryId' in product ? product.categoryId : 0,
          hobbyId: 'hobbyId' in product ? product.hobbyId : 0,
          latitude: 'latitude' in product ? product.latitude : 0,
          longitude: 'longitude' in product ? product.longitude : 0
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
            {latestProducts.map((product: ProductType) => (
              <div key={product.id} className="w-full flex-shrink-0 ">
                <Card
                  title={product.title}
                  description={product.description}
                  image={
                    'thumbnailPath' in product && product.thumbnailPath
                      ? `${product.thumbnailPath}`
                      : 'image' in product
                      ? product.image
                      : ''
                  }
                  price={product.price.toString()}
                  dopamine={'dopamine' in product ? product.dopamine : 5}
                  currentParticipants={
                    'currentParticipants' in product ? product.currentParticipants : 0
                  }
                  maxParticipants={'maxParticipants' in product ? product.maxParticipants : 0}
                  location={
                    'location' in product
                      ? product.location
                      : 'meetingPlace' in product
                      ? product.meetingPlace || ''
                      : ''
                  }
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
