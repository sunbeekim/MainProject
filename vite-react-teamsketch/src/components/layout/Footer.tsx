import { useNavigate, useLocation } from 'react-router-dom';
import { RiStore2Line, RiStore2Fill } from 'react-icons/ri';
import { IoChatbubbleEllipsesOutline, IoChatbubbleEllipses } from 'react-icons/io5';
import { BsGrid, BsGridFill } from 'react-icons/bs';
import { HiOutlineMapPin, HiMapPin } from 'react-icons/hi2';
import { CgUser } from 'react-icons/cg';
import { RiUserFill } from 'react-icons/ri';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPathForLabel = (label: string) => {
    switch (label) {
      case '마켓':
        return '/';
      case '채팅':
        return '/chat';
      case '메뉴':
        return '/requests';
      case '위치':
        return '/location';
      case '마이':
        return '/mypage';
      default:
        return '/';
    }
  };

  const navigationItems = [
    {
      icon: location.pathname === '/' ? <RiStore2Fill /> : <RiStore2Line />,
      label: '마켓',
      onClick: () => navigate('/')
    },
    {
      icon:
        location.pathname === '/chat' ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />,
      label: '채팅',
      onClick: () => navigate('/chat-list')
    },
    {
      icon: location.pathname === '/requests' ? <BsGridFill /> : <BsGrid />,
      label: '메뉴',
      onClick: () => navigate('/requests')
    },
    {
      icon: location.pathname === '/location' ? <HiMapPin /> : <HiOutlineMapPin />,
      label: '위치',
      onClick: () => navigate('/location')
    },
    {
      icon: location.pathname === '/mypage' ? <RiUserFill /> : <CgUser />,
      label: '마이',
      onClick: () => navigate('/mypage')
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#E6CCFF] dark:bg-[#2D2D2D] shadow-lg backdrop-blur-md bg-opacity-95 dark:bg-opacity-90">
      <nav
        className="container mx-auto flex justify-around items-center px-3 py-6"
        id="main-footer"
      >
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center gap-1 p-1.5 bg-transparent hover:bg-transparent focus:outline-none"
          >
            <div
              className={`text-4xl ${
                location.pathname === getPathForLabel(item.label)
                  ? 'text-[#660033]'
                  : 'text-[#ffffff]/70'
              } group-hover:scale-110 transition-transform duration-300`}
            >
              {item.icon}
            </div>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
