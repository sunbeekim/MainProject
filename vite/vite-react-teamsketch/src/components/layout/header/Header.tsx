import { useNavigate } from 'react-router-dom';
import NavigationBar from '../naviform/NavigationBar';
import ThemeToggle from '../../commom/themeToggle/ThemeToggle';

const Header = () => {
  const navigate = useNavigate();

  // 네비게이션 아이템 정의
  const navigationItems = [
    {
      label: '홈',
      onClick: () => navigate('/')
    },
    {
      label: '로그인',
      onClick: () => navigate('/login')
    },
  ];

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-background-light dark:bg-background-dark">
      <NavigationBar items={navigationItems} />
      <ThemeToggle />
    </header>
  );
};

export default Header;
