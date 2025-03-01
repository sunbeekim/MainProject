import ThemeToggle from '../../components/common/ThemeToggle';
import { Link } from 'react-router-dom';
import LogoutModal from '../login/LogoutModal';
import { useState } from 'react';
const Setting = () => {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const handleLogout = () => {
    console.log('로그아웃 실행!');
    setLogoutModalOpen(false);
  };
  return (
    <div className="p-4">      
      모드변경 <ThemeToggle />
      <div>
        <button className="m-2 text-[#6003FF] hover:text-primary-dark px-3 py-1 rounded-md bg-[#F3F2FF] dark:bg-[#1C1C1C] m-2 text-white">
          <Link to="/servicechat">고객센터 챗봇</Link>
        </button>
      </div>
      <div>
        <button onClick={() => setLogoutModalOpen(true)}>로그아웃</button>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Setting;
