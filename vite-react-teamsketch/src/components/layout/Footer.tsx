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
      onClick: () => navigate('/chat')
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
    <footer className="fixed bottom-0 left-0 right-0 bg-[#E6CCFF] dark:bg-[#2D2D2D] shadow-lg backdrop-blur-md bg-opacity-95 dark:bg-opacity-90">
      <nav className="container mx-auto flex justify-around items-center px-2 py-3">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-[#F6CED8]/10 transition-all duration-300 group focus:outline-none dark:bg-background-dark"
          >
            <div className={`text-4xl duration-300 ${
              location.pathname === getPathForLabel(item.label)
                ? 'text-[#660033]' 
                : 'text-[#660033]/70 dark:text-[#660033]/70'
            } group-hover:scale-110 transition-transform duration-300`}>

              {item.icon}
            </div>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
