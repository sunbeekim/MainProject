import { useNavigate } from 'react-router-dom';

const TestPages = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>TestPages</h1>
      <button onClick={() => navigate('/test/marketplace')}>marketplace</button>
      <button onClick={() => navigate('/test/login')}>login</button>
    </div>
  );
};

export default TestPages;
