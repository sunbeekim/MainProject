import { useNavigate } from 'react-router-dom';
import List from '../components/features/list/List';

const TestPages = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>TestPages</h1>
      <button onClick={() => navigate('/test/marketplace')}>marketplace</button>

      <button onClick={() => navigate('/test/productdetails')}>productdetails</button>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">상품 목록</h2>
        <List />
      </div>
    </div>
  );
};

export default TestPages;
