import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import MainLayout from './components/layout/MainLayout';
import { useCategories } from './hooks/useCategories';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AUTH_PATHS, FULLSCREEN_PATHS, FOOTER_HIDDEN_PATHS, isInitialLocationPage } from './components/layout/MainLayout';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { useNotification } from './services/real-time/useNotification';

const App = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // 토큰 및 위치 설정 여부 확인
  const token = localStorage.getItem('token') || undefined;
  const userEmail = localStorage.getItem('userEmail'); // 사용자 이메일 가져오기
  const locationSet = localStorage.getItem('locationSet');
  
  // 헤더/푸터를 표시할지 여부 결정
  const shouldShowHeader = useMemo(() => {
    // 인증 페이지에서는 표시하지 않음
    if (AUTH_PATHS.includes(location.pathname)) return false;
    
    // 전체 화면 경로에서는 표시하지 않음
    for (const path of FULLSCREEN_PATHS) {
      if (location.pathname.includes(path)) return false;
    }
    
    // 첫 로그인 위치 설정 페이지에서는 표시하지 않음
    if (isInitialLocationPage()) return false;
    
    return true;
  }, [location.pathname]);
  
  // 푸터를 표시할지 여부 결정 
  const shouldShowFooter = useMemo(() => {
    // 헤더가 표시되지 않는 경우에는 푸터도 표시하지 않음
    if (!shouldShowHeader) return false;
    
    // 푸터를 숨기는 경로 체크
    for (const path of FOOTER_HIDDEN_PATHS) {
      if (location.pathname.startsWith(path)) return false;
    }
    
    // 내 위치 설정 화면에서는 첫 로그인 여부와 관계없이 항상 푸터를 표시하지 않음
    if (location.pathname === '/my-location') return false;
    
    return true;
  }, [shouldShowHeader, location.pathname]);
  
  useCategories();

  // 인증 라우팅 로직
  useEffect(() => {
    const publicPaths = ['/login', '/signup'];

    // 토큰이 없고 공개 경로가 아닌 경우 로그인 페이지로 이동
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/login');
      return;
    }
    
    // 토큰이 있고 위치 설정이 안 된 경우 첫 로그인으로 간주하여 위치 설정 페이지로 이동
    if (token && !locationSet && location.pathname !== '/my-location') {
      navigate('/my-location');
      return;
    }
  }, [navigate, location.pathname, token, locationSet]);

  // 사용자가 로그인했을 때만 알림 구독
  const NotificationHandler = () => {
    // 알림 상태 가져오기
    const { notifications } = useNotification({
      userEmail: userEmail || '',
      token: token
    });
    
    // 새로운 알림이 오면 토스트 메시지 표시
    useEffect(() => {
      if (notifications.length > 0) {
        const latestNotification = notifications[notifications.length - 1];
        toast.info(latestNotification.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }, [notifications]);
    
    // 이 컴포넌트는 UI를 렌더링하지 않고 알림 처리만 담당
    return null;
  };

  return (
    <WebSocketProvider token={token} autoConnect={!!token}>
      <div className="flex flex-col min-h-screen">
        {shouldShowHeader && <Header />}
        {/* 알림 핸들러 컴포넌트 - 로그인한 경우에만 마운트 */}
        {token && userEmail && <NotificationHandler />}
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        />
      </Routes>
      {shouldShowFooter && <Footer />}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName={() =>
          'relative flex items-center rounded-lg shadow-lg bg-primary-500 text-white text-sm p-4 mb-4 mt-12'
        }
        progressClassName="bg-primary-500"
      />
      </div>
    </WebSocketProvider>
  );
};

export default App;
