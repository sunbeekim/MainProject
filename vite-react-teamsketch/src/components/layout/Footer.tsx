import { useNavigate, useLocation } from 'react-router-dom';
import { RiStore2Line, RiStore2Fill } from 'react-icons/ri';
import {
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipses,
  IoNotificationsOutline,
  IoNotifications
} from 'react-icons/io5';
import { HiOutlineMapPin, HiMapPin } from 'react-icons/hi2';
import { CgUser } from 'react-icons/cg';
import { RiUserFill } from 'react-icons/ri';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChatRoom = location.pathname.includes('/chat/');
  const isServiceChat = location.pathname.includes('/servicechat');

  const getPathForLabel = (label: string) => {
    switch (label) {
      case '마켓':
        return '/';
      case '채팅':
        return '/chat';
      case '알림':
        return '/notification';
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
      icon:
        location.pathname === '/notification' ? <IoNotifications /> : <IoNotificationsOutline />,
      label: '알림',
      onClick: () => navigate('/notification')
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
  if (isChatRoom || isServiceChat) {
    return null; // 채팅방 페이지에서는 Footer를 렌더링하지 않음
  }
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-primary-500 dark:bg-background-dark dark:bg-opacity-90">
      <nav
        className="container mx-auto flex justify-around items-center px-3 py-2"
        id="main-footer"
      >
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center pb-5 gap-1 bg-transparent hover:bg-transparent focus:outline-none"
          >
            <div
              className={`text-3xl ${
                location.pathname === getPathForLabel(item.label)
                  ? 'text-primary-dark'
                  : 'text-light'
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
