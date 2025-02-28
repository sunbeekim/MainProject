import { useTestApi } from '../../services/api/testAPI';
import FloatingButton from '../../components/common/FloatingButton';
import { useNavigate } from 'react-router-dom';
import Category from '../../components/common/categoryicon';
import CardList from '../../test/components/features/card/CardList';


//test api 호출 페이지


const MarketList = () => {


  const navigate = useNavigate();

  
  const productData = [
    { title: '상품 1', description: '상품 설명 1', image: 'img' },
    { title: '상품 2', description: '상품 설명 2', image: 'img' },
    { title: '상품 3', description: '상품 설명 3', image: 'img' },
    { title: '상품 4', description: '상품 설명 4', image: 'img' },   
  ];
  

  const { useHello, useEcho, useHealth } = useTestApi();

  const { data: helloData, refetch: refetchHello } = useHello();
  const { data: healthData, refetch: refetchHealth } = useHealth();
  const { mutate: echoMutate, data: echoData } = useEcho();


  const handleSendtest = () => {
    refetchHello();
  };

  const handleSendtest2 = () => {
    echoMutate({ message: '안녕하세요' });
  };

  const handleSendtest3 = () => {
    refetchHealth();
  };

  const handleNavigateToProductRegister = () => {
    navigate('/product/register');
  };

  return (
    <div>
      <h1>MarketList [test api 호출]</h1>


      <Category />      
      <button onClick={handleSendtest}>
        hello endpoint 호출
      </button>
      <button onClick={handleSendtest2}>
        echo endpoint 호출
      </button>
      <button onClick={handleSendtest3}>
        health endpoint 호출
      </button>

      <div>
        {helloData && (
          <div>
            <h3>Hello Endpoint Response:</h3>
            <pre>{JSON.stringify(helloData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        {healthData && (
          <div>
            <h3>Health Endpoint Response:</h3>
            <pre>{JSON.stringify(healthData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        {echoData && (
          <div>
            <h3>Echo Endpoint Response:</h3>
            <pre>{JSON.stringify(echoData, null, 2)}</pre>
          </div>
        )}
      </div>
      <div >
        <h2 className="text-xl font-bold mb-4">최신 상품</h2>       
        <CardList items={productData} />
      </div>

      <div >
        <h2 className="text-xl font-bold mb-4">추천 상품</h2>       
        <CardList items={productData} />
     </div>

 

      {/* ======================================== */}
      <div className="gap-4 pt-10 pl-10 flex items-center">
        <button onClick={() => navigate('/test/pages')}>테스트 페이지</button>
        <button onClick={() => navigate('/test/component')}>테스트 컴포넌트</button>
        <button onClick={() => navigate('/test/func')}>테스트 함수</button>
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
