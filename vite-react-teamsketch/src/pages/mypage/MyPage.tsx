import { useState } from 'react';
import LogoutModal from '../../components/common/LogoutModal';
const MyPage = () => {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const handleLogout = () => {
    console.log('로그아웃 실행!');
    setLogoutModalOpen(false);
  };

  return (
    <div>
      <h1>MyPage</h1>
      <div>
        <div className="border p-4 font-bold dark:text-text-dark ">
          <h2>프로필</h2>
          <p>이름: 홍길동</p>
          <p>이메일: hong@example.com</p>
        </div>
        <span
          onClick={() => setLogoutModalOpen(true)}
          className="mt-4 px-4 py-2 underline cursor-pointer hover:text-red-600"
        >
          로그아웃
        </span>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default MyPage;
