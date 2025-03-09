import { useLocation, useNavigate } from 'react-router-dom';
import { IconSetting, Iconalarm } from '../common/Icons';
import BackButton from '../forms/button/BackButton';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const getHeaderContent = () => {
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
              <Iconalarm
                className="text-gray-500 cursor-pointer "
                onClick={() => alert('Alarm icon clicked!')}
              />
            </div>
          )
        };

      case '/login':
        return {
          title: '로그인'
        };
      case '/signup':
        return {
          title: '회원가입'
        };
      case '/mypage':
        return {
          title: '마이페이지',
          actions: (
            <div className="flex gap-2">
              <IconSetting
                onClick={() => navigate('/setting')}
                className="w-8 h-8 text-[#59151C] hover:text-primary-dark cursor-pointer"
              />
            </div>
          )
        };
      case '/setting':
        return {
          title: '설정'
        };
      default:
        return {
          title: '404'
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 bg-[#F3F2FF] dark:bg-background-dark border-b border-[#E5E1FF] dark:border-[#ffffff]/70 shadow-sm"
    >
      <Grid cols={3} gap="sm" className="items-center px-2 py-1 h-12">
        {/* 왼쪽: 백버튼 */}
        <GridItem className="flex items-center h-full">
          {!isAuthPage ? (
            <BackButton className="text-[#FFFFFF] hover:bg-[#59151C] p-1 rounded text-sm" />
          ) : (
            <div className="w-8" />
          )}
        </GridItem>

        {/* 중앙: 타이틀 */}
        <GridItem className="text-center flex flex-col justify-center h-full">
          <h1 className="text-sm font-bold text-[#59151C] dark:text-text-dark">
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
