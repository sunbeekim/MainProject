import { useNavigate } from 'react-router-dom';
import IList from '../components/features/list/IList';

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
      <button onClick={() => navigate('/test/locationlayout')}>테스트 위치 레이아웃</button>
      <button onClick={() => navigate('/test/openmap')}>테스트 오픈맵</button>
      <button onClick={() => navigate('/test/searchlocation')}>테스트 검색 위치</button>
      <button onClick={() => navigate('/test/location')}>테스트 검색 오픈맵 위치</button>
      <button onClick={() => navigate('/test/mypagelayout')}>테스트 마이페이지 레이아웃</button>
      <button onClick={() => navigate('/test/mypage')}>테스트 마이페이지</button>
      <button onClick={() => navigate('/test/profilemanage')}>테스트 프로필 관리</button>
      <div>
        <IList />
      </div>
    </div>
  );
};

export default TestPages;
