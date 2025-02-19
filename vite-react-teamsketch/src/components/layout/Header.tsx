import { useLocation, useNavigate } from 'react-router-dom';
import { IconSetting } from '../common/Icons';

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
              <select className="px-3 py-1 text-sm rounded-full bg-primary-light text-white">
                <option value="1">운동</option>
                <option value="2">취미</option>
                <option value="3">기타</option>
              </select>
              <select className="px-3 py-1 text-sm rounded-full bg-primary-light text-white">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
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
              className="w-8 h-8 text-primary-light"
              />
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
    <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3">
        <h1 className="text-xl font-bold">{headerContent.title}</h1>
        {headerContent.subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{headerContent.subtitle}</p>
        )}
        {headerContent.actions}
      </div>
    </header>
  );
};

export default Header;
