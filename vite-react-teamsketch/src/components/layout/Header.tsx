import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconSetting, Iconalarm } from '../common/Icons';
import BackButton from '../forms/button/BackButton';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';
import { useAppSelector } from '../../store/hooks';
import FilterButton from '../common/FilterButton';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { token } = useAppSelector((state) => state.auth);

  // 읽지 않은 알림 체크
  useEffect(() => {
    const checkUnreadNotifications = async () => {
      try {
        // TODO: API 호출로 대체
        const mockResponse = { hasUnread: true };
        setHasUnreadNotifications(mockResponse.hasUnread);
      } catch (error) {
        console.error('알림 상태 확인 실패:', error);
      }
    };

    if (token) {
      checkUnreadNotifications();
    }
  }, [token]);

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
            <div className="flex gap-2">

              <button
                onClick={() => navigate('/test/pages')}
                className="text-[#59151C] hover:text-primary-dark px-3 py-1 rounded-md bg-[#F3F2FF]"
              >
                testpage
              </button>
              <FilterButton />
              <Iconalarm hasNotification={hasUnreadNotifications} className="w-6 h-6" />
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
        </GridItem>
      </Grid>
    </header>
  );
};

export default Header;
