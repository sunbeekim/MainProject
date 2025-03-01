import { useNavigate } from 'react-router-dom';

const TestPages = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>TestPages</h1>
        <button onClick={() => navigate('/test/marketplace')}>marketplace</button>
        <button onClick={() => navigate('/test/productdetails')}>productdetails</button>         
        <button onClick={() => navigate('/test/component')}>테스트 컴포넌트</button>
        <button onClick={() => navigate('/test/func')}>테스트 함수</button>
        <button onClick={() => navigate('/test/api')}>테스트 API</button>
    
    </div>
  );
};

export default TestPages;
