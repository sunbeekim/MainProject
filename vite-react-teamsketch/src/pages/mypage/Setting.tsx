import ThemeToggle from '../../components/common/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModal from '../account/LogoutModal';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Setting = () => {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('로그아웃 실행!');
    dispatch(logout());
    localStorage.removeItem('token');
    setLogoutModalOpen(false);
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleDeleteAccount = () => {
    navigate('/delete-account');
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between p-2 bg-[#F3F2FF] dark:bg-[#1C1C1C] rounded-lg">
        <span className="text-[#4A4A4A] dark:text-white">모드변경</span>
        <ThemeToggle />
      </div>

      <div className="p-2">
        <button className="w-full text-[#6003FF] hover:text-primary-dark px-4 py-2 rounded-lg bg-[#F3F2FF] dark:bg-[#1C1C1C] dark:text-white transition-colors">
          <Link to="/servicechat" className="flex items-center justify-center">
            고객센터 챗봇
          </Link>
        </button>
      </div>
      {/* 로그아웃 */}
      <div className="p-2">
        <button
          onClick={() => setLogoutModalOpen(true)}
          className="w-full px-4 py-2 text-[#4A4A4A] bg-[#F6CED8] hover:bg-[#F9B0BA] rounded-lg transition-colors"
        >
          로그아웃
        </button>
      </div>

      {/* 비밀번호 변경 */}
      <div className="p-2">
        <button
          onClick={handleChangePassword}
          className="w-full px-4 py-2 text-[#4A4A4A] bg-[#F6CED8] hover:bg-[#F9B0BA] rounded-lg transition-colors"
        >
          비밀번호 변경
        </button>
      </div>

      <div className="p-2">
        <button
          onClick={handleDeleteAccount}
          className="w-full px-4 py-2 text-[#4A4A4A] bg-[#F6CED8] hover:bg-[#F9B0BA] rounded-lg transition-colors"
        >
          회원탈퇴
        </button>
      </div>

      {/* 로그아웃모달 */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Setting;
