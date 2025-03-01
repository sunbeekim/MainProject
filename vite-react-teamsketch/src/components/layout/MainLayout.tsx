import { Routes, Route } from 'react-router-dom';
import MarketList from '../../pages/marketplace/MarketList';
import Login from '../../pages/login/Login';
import Signup from '../../pages/login/Signup';
import ServiceChat from '../../pages/mypage/AIChatBot';
import Location from '../../pages/map/Location';
import MyPage from '../../pages/mypage/MyPage';
import Requests from '../../pages/trading/Requests';
import Setting from '../../pages/mypage/Setting';
import TestComponent from '../../testpages/TestComponent';
import TestMarketplace from '../../testpages/TestMarketplace';
import TestPages from '../../testpages/TestPages';
import TestFunc from '../../testpages/TestFunc';
import TestProductDetails from '../../testpages/TestProductDetails';
import TestAPI from '../../testpages/TestAPI';

const MainLayout = () => {
  return (
    <main className="main-content mb-3">
      <Routes>
        <Route path="/" element={<MarketList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/servicechat" element={<ServiceChat />} />
        <Route path="/location" element={<Location />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/setting" element={<Setting />} />

        {/* test pages */}
        <Route path="/test/pages" element={<TestPages />} />
        <Route path="/test/marketplace" element={<TestMarketplace />} />
        <Route path="/test/productdetails" element={<TestProductDetails />} />
        <Route path="/test/component" element={<TestComponent />} />
        <Route path="/test/func" element={<TestFunc />} />
        <Route path="/test/api" element={<TestAPI />} />
      </Routes>
    </main>
  );
};

export default MainLayout; 