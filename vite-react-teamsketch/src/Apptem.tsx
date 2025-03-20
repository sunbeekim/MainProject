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
  const locationSet = localStorage.getItem('locationSet');

  const user = localStorage.getItem('user'); // 사용자 정보 가져오기
  const userEmail = JSON.parse(user || '{}').email; // 이메일 추출
  console.log("user", user);
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
    // 로그인 정보 확인 로그 추가
    console.log('[알림 디버그] ==== NotificationHandler 시작 ====');
    console.log('[알림 디버그] 토큰 존재 여부:', !!token);
    console.log('[알림 디버그] 사용자 이메일:', userEmail);
    
    // 알림 상태 가져오기
    const { notifications, isConnected, connect } = useNotification({
      userEmail: userEmail || '',
      token: token
    });
    
    // 컴포넌트 마운트 시 연결 시도
    useEffect(() => {
      console.log('[알림 디버그] NotificationHandler 마운트됨, 연결 시도...');
      if (userEmail && token) {
        console.log('[알림 디버그] 알림 서비스 연결 시도:', userEmail);
        connect();
      } else {
        console.error('[알림 디버그] 연결 불가: 인증 정보 누락');
      }
    }, [userEmail, token, connect]);
    
    // 새로운 알림이 오면 토스트 메시지 표시
    useEffect(() => {
      console.log('[알림 디버그] 알림 상태 변경:', notifications.length, '개 / 연결됨:', isConnected);
      
      if (notifications.length > 0) {
        const latestNotification = notifications[notifications.length - 1];
        console.log('[알림 디버그] 토스트 메시지 표시 시도:', latestNotification);
        
        // 토스트 메시지 표시
        try {
          toast.info(latestNotification.message, {
            position: "top-center",
            autoClose: 5000, // 알림 지속 시간 증가
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            className: "relative flex items-center rounded-lg shadow-lg bg-primary-500 text-white text-sm p-4 mb-4 mt-12"
          });
          console.log('[알림 디버그] 토스트 메시지 표시 완료');
        } catch (error) {
          console.error('[알림 디버그] 토스트 메시지 표시 오류:', error);
        }
      }
    }, [notifications, isConnected]);
    
    // WebSocket 연결 상태 모니터링
    useEffect(() => {
      console.log('[알림 디버그] WebSocket 연결 상태:', isConnected ? '연결됨' : '연결 안됨');
    }, [isConnected]);
    
    // 컴포넌트 언마운트 시 로그 추가
    useEffect(() => {
      return () => {
        console.log('[알림 디버그] NotificationHandler 언마운트됨');
      };
    }, []);
    
    // 이 컴포넌트는 UI를 렌더링하지 않고 알림 처리만 담당
    return null;
  };

  return (
    <WebSocketProvider token={token} autoConnect={!!token}>
      <div className="flex flex-col min-h-screen">
        {shouldShowHeader && <Header />}
        
        {/* 알림 핸들러 컴포넌트 - 로그인한 경우에만 마운트 */}
        {token && userEmail ? <NotificationHandler /> : (() => {
          console.log('[알림 디버그] NotificationHandler 마운트되지 않음 - token:', !!token, 'email:', !!userEmail);
          return null;
        })()}
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
