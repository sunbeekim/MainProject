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
          images: 'imagePaths' in product && Array.isArray(product.imagePaths)
            ? product.imagePaths
            : ['image' in product ? product.image : ''],
          mainCategory: 'category' in product ? product.category : '',
          subCategory: '',
          dopamine: 'dopamine' in product ? product.dopamine : 0,
          number: product.id,
          description: product.description,
          maxParticipants: 'maxParticipants' in product ? product.maxParticipants : 0,
          currentParticipants: 'currentParticipants' in product ? product.currentParticipants : 0,
          location: 'location' in product ? product.location : ('meetingPlace' in product ? product.meetingPlace || '' : ''),
          startDate: 'createdAt' in product ? product.createdAt : '',
          endDate: 'endDate' in product ? product.endDate : '',
          title: product.title,
          price: product.price
        }
      }
    });
  };

  if (isLatestLoading ) {
    return <div className="container mx-auto px-4 py-6">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Category categorySize="md" onCategorySelect={handleCategorySelect} />

      {/* 최신 상품 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory ? '카테고리별 상품' : '최신 상품'}
        </h2>
        <div className="overflow-x-auto no-scrollbar md:scrollbar-thin md:scrollbar-thumb-gray-400 md:scrollbar-track-gray-100">
          <div className="flex gap-4 pb-4 min-w-max">
            {latestProducts.map((product: ProductType) => (
              <div key={product.id} className="w-[280px] flex-shrink-0">
                <Card
                  title={product.title}
                  description={product.description}
                  image={
                    'thumbnailPath' in product && product.thumbnailPath
                      ? `http://localhost:8081/api/core/market/images/${product.thumbnailPath}`
                      : ('image' in product ? product.image : '')
                  }
                  price={product.price}
                  dopamine={'dopamine' in product ? product.dopamine : 0}
                  currentParticipants={
                    'currentParticipants' in product ? product.currentParticipants : 0
                  }
                  maxParticipants={'maxParticipants' in product ? product.maxParticipants : 0}
                  location={'location' in product ? product.location : ('meetingPlace' in product ? product.meetingPlace || '' : '')}
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
