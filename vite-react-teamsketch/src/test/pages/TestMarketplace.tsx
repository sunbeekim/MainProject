import { useState } from 'react';
import Container from '../components/layout/Container';
import Card from '../components/features/card/Card';
import Button from '../components/common/button/Button';

const TestMarketplace = () => {
  const [items] = useState([
    {
      id: 1,
      title: '테스트 상품 1',
      description: '테스트 상품 설명 1',
      image: 'test1.jpg'
    },
    {
      id: 2,
      title: '테스트 상품 2',
      description: '테스트 상품 설명 2',
      image: 'test2.jpg'
    }
  ]);

  return (    
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">테스트 마켓</h1>
        <Button variant="primary">상품 등록</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <Card
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
          />
        ))}
      </div>
    </Container>
  );
};

export default TestMarketplace; 