import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MarketList from '../../pages/marketplace/MarketList';
import Login from '../../pages/account/Login';
import Signup from '../../pages/account/Signup';
import ServiceChat from '../../pages/mypage/AIChatBot';
import Location from '../../pages/map/Location';
import MyPage from '../../pages/mypage/MyPage';
import Requests from '../../pages/trading/Requests';
import Setting from '../../pages/mypage/Setting';
import ForgotPassword from '../../pages/account/ForgotPassword';
import ProductRegister from '../../pages/marketplace/ProductRegister';
//================== Test =========================
import TestComponent from '../../testpages/TestComponent';
import TestMarketplace from '../../testpages/TestMarketplace';
import TestPages from '../../testpages/TestPages';
import TestFunc from '../../testpages/TestFunc';
import TestProductDetails from '../../testpages/TestProductDetails';
import TestAPI from '../../testpages/TestAPI';

const MainLayout = () => {
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeights = () => {
      const footer = document.getElementById('main-footer');
      const header = document.getElementById('main-header');
      
      if (footer) {
        setFooterHeight(footer.offsetHeight);
      }
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  return (
    <main className="fixed inset-0 w-full">
      <div 
        className="content-scroll"
        style={{ 
          height: `calc(100vh - env(safe-area-inset-bottom))`,
          paddingBottom: `${footerHeight}px`,
          paddingTop: `${headerHeight}px`,
        }}
      >
        <Routes>
          <Route path="/" element={<MarketList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/servicechat" element={<ServiceChat />} />
          <Route path="/location" element={<Location />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/product/register" element={<ProductRegister />} />

          {/* test pages */}
          <Route path="/test/pages" element={<TestPages />} />
          <Route path="/test/marketplace" element={<TestMarketplace />} />
          <Route path="/test/productdetails" element={<TestProductDetails />} />
          <Route path="/test/component" element={<TestComponent />} />
          <Route path="/test/func" element={<TestFunc />} />
          <Route path="/test/api" element={<TestAPI />} />
        </Routes>
      </div>
    </main>
  );
};

export default MainLayout; 