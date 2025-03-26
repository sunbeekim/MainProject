import { useState, memo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FloatingButton from '../../components/common/FloatingButton';
import Category from '../../components/common/CategoryIcon';
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

import FilterButton from '../../components/common/FilterButton';
import { getProductNearBy } from '../../services/api/productAPI';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { RootState } from '../../store/store';
import { setDistance } from '../../store/slices/productSlice';


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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const distance = useAppSelector((state: RootState) => state.product.distance);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();


  // 상품 Query - 카테고리 선택에 따라 다른 API 호출
  const { data: queryProducts = [], isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, distance],
    queryFn: async () => {
      try {
        let response;

        // 거리 기반 조회가 선택된 경우
        if (distance > 0) {
          response = await getProductNearBy(distance);
          // 카테고리가 선택된 경우 필터링 적용
          if (selectedCategory) {
            const filteredProducts = response.data.filter((product: IProduct) => 
              selectedCategory === 0 ? true : product.categoryId === selectedCategory
            );
            return filteredProducts;
          }
        }
        // 카테고리가 선택되었으면 카테고리별 조회, 아니면 전체 조회
        else if (selectedCategory) {
          response = await getProductsByCategory(selectedCategory);
        } else {
          response = await getProducts();
        }       

        return response.data || [];
      } catch (error) {
        console.error('API 요청 실패:', error);
        // 에러 발생 시 한 번만 토스트 메시지 표시
        toast.error('상품 목록을 불러오는 중 오류가 발생했습니다.');
      }
    },
    gcTime: 60000,
    staleTime: 30000
  });

  // 상품 목록 상태 업데이트
  useEffect(() => {
    if (queryProducts) {
      setProducts(queryProducts);
    }
<<<<<<< HEAD
  }, [queryProducts]); // queryProducts의 길이만 의존성으로 사용
=======
  }, [queryProducts.length]);
>>>>>>> ccf50cd17491fccab34bccb4bb908ecd4f47b44a

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

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
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

  const handleDistanceChange = useCallback(async (newDistance: number) => {
    if (loading) return;
    setLoading(true);
    try {
      dispatch(setDistance(newDistance));
      const response = await getProductNearBy(newDistance);
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('거리 기반 상품 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  if (isPageLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loading />
        <p className="mt-4 text-gray-600">상품 목록을 불러오는 중입니다...</p>
      </div>
    );
  }


  return (
    <div className="w-full mt-4">
<<<<<<< HEAD
      <Category categorySize="md" onCategorySelect={handleCategorySelect} />
=======
>>>>>>> ccf50cd17491fccab34bccb4bb908ecd4f47b44a
      <div className="flex justify-end mt-4 mr-4">
        <FilterButton onDistanceChange={handleDistanceChange} />
      </div>      
      <Category categorySize="md" onCategorySelect={handleCategorySelect} />
      
      {/* 상품 목록 */}
<<<<<<< HEAD
      <div className="mt-4 px-4 justify-end">
        <div className="no-scrollbar md:scrollbar-thin md:scrollbar-thumb-gray-400 md:scrollbar-track-gray-100">
=======
      <div className="mt-4 px-4 justify-end">      
        <div className="no-scrollbar md:scrollbar-thin md:scrollbar-track-gray-100 md:scrollbar-thumb-gray-400">
>>>>>>> ccf50cd17491fccab34bccb4bb908ecd4f47b44a
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
