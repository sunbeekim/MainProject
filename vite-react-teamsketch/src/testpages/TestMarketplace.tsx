
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingButton from '../components/common/FloatingButton';
import Category from '../components/common/categoryicon';
import CardList from '../components/features/card/CardList';
import { mockAPI } from '../mock/mockAPI';
import { IProduct } from '../mock/mockData';

//test api 호출 페이지

const MarketList = () => {
  const navigate = useNavigate();
  const [latestProducts, setLatestProducts] = useState<IProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [latestResponse, recommendedResponse] = await Promise.all([
          mockAPI.market.getLatestProducts(),
          mockAPI.market.getRecommendedProducts()
        ]);
        
        setLatestProducts(latestResponse.data.products);
        setRecommendedProducts(recommendedResponse.data.products);
      } catch (error) {
        console.error('상품 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleNavigateToProductRegister = () => {
    navigate('/product/register');
  };

  const handleCategorySelect = async (category: string) => {
    try {
      const response = await mockAPI.market.getProductsByCategory(category);
      setLatestProducts(response.data.products);
      setSelectedCategory(category);
    } catch (error) {
      console.error('카테고리별 상품을 불러오는데 실패했습니다:', error);

    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Category onCategorySelect={handleCategorySelect} />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory ? `${selectedCategory} 관련 상품` : '최신 상품'}
        </h2>
        <CardList items={latestProducts} />
      </div>

      {!selectedCategory && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">추천 상품</h2>
          <CardList items={recommendedProducts} />
        </div>
      )}

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
