import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MarketList from '../../pages/marketplace/MarketList';
import Login from '../../pages/account/Login';
import Signup from '../../pages/account/Signup';
import ServiceChat from '../../pages/mypage/AIChatBot';
import ShareLocationMap from '../../pages/map/ShareLocationMap';
import MyPage from '../../pages/mypage/MyPage';
import Setting from '../../pages/mypage/Setting';
import ForgotPassword from '../../pages/account/ForgotPassword';
import ProductRegister from '../../pages/marketplace/ProductRegister';
import VerifyMethod from '../../pages/account/VerifyMethod';
import VerficationCode from '../../pages/account/VerificationCode';
import ResetPassword from '../../pages/account/ResetPassword';
import ChatList from '../../pages/chatroom/ChatList';
import ChatRoom from '../../pages/chatroom/ChatRoom';
import ProdLocationMap from '../../pages/marketplace/ProdLocationMap';
import ChangePassword from '../../pages/account/ChangePassword';
import ProductDetails from '../../pages/marketplace/ProductDetails';
import ProfileManage from '../../pages/mypage/ProfileManage';
import NotificationList from '../../pages/notification/NotificationList';
import RegisteredCard from '../../pages/payment/RegisteredCard';
import CardDetails from '../../pages/payment/CardDetails';
import TransactionList from '../../pages/Transaction history/TrasactionList';
import SalesList from '../../pages/Transaction history/SalesList';
import PurchaseList from '../../pages/Transaction history/PurchaseList';
import MyProducts from '../../pages/mypage/MyProducts';
import TransactionDetail from '../../pages/Transaction history/TransactionDetail';
import CSList from '../../pages/CScenter/CSList';
import InquiryHistory from '../../pages/CScenter/InquiryHistory';
import DeleteAccount from '../../pages/account/DeleteAccount';
import OCRUpload from '../../pages/payment/OCRUpload';
import DeleteModal from '../../pages/payment/DeleteModal';
//================== Test =========================
import TestComponent from '../../testpages/TestComponent';
import TestPages from '../../testpages/TestPages';
import TestFunc from '../../testpages/TestFunc';
import TestGrid from '../../testpages/TestGrid';

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
          paddingTop: `${headerHeight}px`
        }}
      >
        <Routes>
          <Route path="/" element={<MarketList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/servicechat" element={<ServiceChat />} />
          <Route path="/location" element={<ShareLocationMap />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/notification" element={<NotificationList />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/product/register" element={<ProductRegister />} />
          <Route path="/verify-method" element={<VerifyMethod />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verfication-code" element={<VerficationCode />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/product/location" element={<ProdLocationMap />} />
          <Route path="/chat/:email" element={<ChatRoom />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile-manage" element={<ProfileManage />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/registered-card" element={<RegisteredCard />} />
          <Route path="/card-details/:cardId" element={<CardDetails />} />
          <Route path="/transaction-list" element={<TransactionList />} />
          <Route path="/sales-list" element={<SalesList />} />
          <Route path="/purchase-list" element={<PurchaseList />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/transaction-detail/:transactionId" element={<TransactionDetail />} />
          <Route path="/cs-list" element={<CSList />} />
          <Route path="/inquiry-history" element={<InquiryHistory />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/ocr-upload" element={<OCRUpload />} />
          <Route path="/delete-modal" element={<DeleteModal/>} />

          {/* test pages */}
          <Route path="/test/pages" element={<TestPages />} />
          <Route path="/test/component" element={<TestComponent />} />
          <Route path="/test/func" element={<TestFunc />} />
          <Route path="/test/grid" element={<TestGrid />} />
        </Routes>
      </div>
    </main>
  );
};

export default MainLayout;
