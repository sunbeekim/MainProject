import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconChat, IconList, IconMap, IconUser } from '../common/Icons'

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {

      icon: <IconHome className={`w-8 h-8 ${location.pathname === '/' ? 'text-primary-light' : ''}`} />,
      onClick: () => navigate('/')
    },
    {
     
      icon: <IconChat className={`w-8 h-8 ${location.pathname === '/chat' ? 'text-primary-light' : ''}`} />,
      onClick: () => navigate('/chat')
    },
    {
    
      icon: <IconList className={`w-8 h-8 ${location.pathname === '/requests' ? 'text-primary-light' : ''}`} />,
      onClick: () => navigate('/requests')
    },
    {
      
      icon: <IconMap className={`w-8 h-8 ${location.pathname === '/location' ? 'text-primary-light' : ''}`} />,
      onClick: () => navigate('/location')
    },
    {
    
      icon: <IconUser className={`w-8 h-8 ${location.pathname === '/mypage' ? 'text-primary-light' : ''}`} />,
      onClick: () => navigate('/mypage')
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700">
      <nav className="flex justify-around items-center px-2 py-3">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center gap-1"
          >
            {item.icon}
           
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
