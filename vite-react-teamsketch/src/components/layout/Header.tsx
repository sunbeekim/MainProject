import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconSetting, Iconalarm } from '../common/Icons';
import BackButton from '../forms/button/BackButton';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';
import { useAppSelector } from '../../store/hooks';
import { useNotification } from '../../services/real-time/useNotification';


interface HeaderProps {
  onDistanceChange: (distance: number) => void;
}
const Header: React.FC<HeaderProps> = ({ onDistanceChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((state) => state.auth);
  const { notifications, isConnected, connect } = useNotification({
    userEmail: user?.email || undefined,
    token: token || undefined
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // 읽지 않은 알림 수 업데이트
  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  // 웹소켓 연결
  useEffect(() => {
    if (user?.email && token && !isConnected) {
      connect();
    }
  }, [user?.email, token, isConnected, connect]);

  // URL 경로를 기반으로 제목 추출하는 함수
  const getFormattedTitle = (path: string) => {
    const pathSegments = path.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || '404';
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getHeaderContent = () => {
    // 채팅방 경로 확인
    if (location.pathname.startsWith('/chat/')) {
      const state = location.state as { chatname?: string };
      return {
        title: state?.chatname ? `${state.chatname}` : '채팅'
      };
    } else if (location.pathname.startsWith('/share')) {
      return {
        title: '위치 공유하기'
      };
    }

    switch (location.pathname) {
      case '/':
        return {
          title: 'MarketPlace',
          actions: (
            <div className="flex gap-2 justify-center items-center">
              <button
                onClick={() => {                  
                  navigate('/test/pages');                  
                }}
                className="text-[#59151C] hover:text-primary-dark px-3 py-1 rounded-md bg-[#F3F2FF]"
              >
                testpage
            </div>
          )
        };
      case '/servicechat':
        return {
          title: 'AI 고객센터'
        };
      case '/mypage':
        return {
          title: '마이페이지',
          actions: (
            <div className="flex gap-2">
              <IconSetting
                onClick={() => navigate('/setting')}
                className="w-8 h-8 text-primary-50 hover:text-primary-dark cursor-pointer dark:text-primary-500 dark:hover:text-primary-dark"
              />
            </div>
          )
        };
      case '/setting':
        return {
          title: '설정'
        };
      case '/chat-list':
        return {
          title: '채팅목록'
        };
      case '/notification':
        return {
          title: '알림'
        };
      case '/my-location':
        return {
          title: '내 위치 설정'
        };
      default:
        return {
          title: getFormattedTitle(location.pathname)
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 bg-primary-500 dark:bg-background-dark dark:border-primary-dark/70 shadow-sm"
    >
      <Grid cols={3} gap="sm" className="items-center px-2 py-1 h-12">
        {/* 왼쪽: 백버튼 */}
        <GridItem className="flex items-center h-full">
          <BackButton className="text-light hover:bg-primary-dark p-1 rounded text-sm" />
        </GridItem>

        {/* 중앙: 타이틀 */}
        <GridItem className="text-center flex flex-col justify-center h-full">
          <h1 className="text-sm font-bold text-primary-50 dark:text-text-dark">
            {headerContent.title}
          </h1>
        </GridItem>

        {/* 오른쪽: 액션 버튼 */}
        <GridItem className="flex justify-end items-center h-full text-sm">
          {headerContent.actions}
          {location.pathname === '/' && (
            <div className="relative ml-2">
              <Iconalarm 
                onClick={() => {
                  navigate('/notification');
                  setUnreadCount(0);
                }}
                className="w-6 h-6 cursor-pointer text-primary-50 dark:text-text-dark" 
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
          )}
        </GridItem>
      </Grid>
    </header>
  );
};

export default Header;
