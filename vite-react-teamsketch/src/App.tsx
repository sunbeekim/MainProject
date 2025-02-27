import { Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MarketList from './pages/marketplace/MarketList';
import Login from './pages/login/Login';
import Signup from './pages/login/Signup';
import ServiceChat from './pages/mypage/AIChatBot';
import Location from './pages/map/Location';
import MyPage from './pages/mypage/MyPage';
import Requests from './pages/trading/Requests';
import Setting from './pages/mypage/Setting';

// test
import TestComponent from './testpages/TestComponent';

import TestMarketplace from './testpages/TestMarketplace';
import TestPages from './testpages/TestPages';
import TestSignup from './testpages/TestSignup';
import TestFunc from './testpages/TestFunc';

const App = () => {
  return (
    <div className="min-h-screen pb-16">
      <Header />
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
          <Route path="/test/signup" element={<TestSignup />} />

          {/* test component */}
          <Route path="/test/component" element={<TestComponent />} />

          {/* test func */}
          <Route path="/test/func" element={<TestFunc />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
