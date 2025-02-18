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
const App = () => {
  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MarketList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/servicechat" element={<ServiceChat />} />
          <Route path="/location" element={<Location />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
