import { useLocation, useNavigate } from 'react-router-dom';
import { IconSetting } from '../common/Icons';
import BackButton from '../forms/button/BackButton';

import { Iconalarm } from '../common/Icons';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getHeaderContent = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: '#대분류',
          actions: (
            <div className="flex gap-2">              
              <button onClick={() => navigate('/test/pages')}>테스트 페이지</button>
              <button onClick={() => navigate('/test/component')}>테스트 컴포넌트</button>     
              <button onClick={() => navigate('/test/func')}>테스트 함수</button>
              <Iconalarm className="text-gray-500 cursor-pointer " onClick={() => alert("Alarm icon clicked!")} />

            </div>
          )
        };
      case '/login':
        return {
          title: '로그인',
          subtitle: '서비스를 이용하기 위해 로그인해주세요'
        };
      case '/signup':
        return {
          title: '회원가입',
          subtitle: '환영합니다! 계정을 생성해주세요'
        };
      case '/mypage':
        return {
          title: '마이페이지',
          subtitle: '회원 정보를 확인하고 수정할 수 있습니다',
          actions: (
            <div className="flex gap-2">
              <IconSetting
                onClick={() => navigate('/setting')}
                className="w-8 h-8 text-[#59151C] hover:text-primary-dark cursor-pointer"
              />
              <button 
                onClick={() => navigate('/login')}
                className="text-[#59151C] hover:text-primary-dark px-3 py-1 rounded-md bg-[#F3F2FF]"
              >
                login
              </button>
            </div>
          )
        };
      default:
        return {
          title: '404',
          subtitle: '페이지를 찾을 수 없습니다'
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <header className="sticky top-0 z-50 bg-[#F3F2FF] dark:bg-background-dark border-b border-[#E5E1FF] dark:border-[#6003FF] shadow-sm">
      <BackButton className="m-5 text-[#FFFFFF] hover:bg-[#59151C] " />
      <div className="px-4 py-3">
        <h1 className="text-xl font-bold text-[#59151C] dark:text-text-dark">{headerContent.title}</h1>
        {headerContent.subtitle && (
          <p className="text-sm text-[#59151C]/70 dark:text-text-dark/70">
            {headerContent.subtitle}
          </p>
        )}
        {headerContent.actions}
      </div>
    </header>
  );
};

export default Header;
