import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/BaseButton';
import LoginLayout from '../../components/layout/LoginLayout';
import PasswordInput from '../../components/forms/input/PasswordInput';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmitChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentPassword.length < 8) {
      alert('현재 비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    alert('비밀번호가 성공적으로 변경되었습니다.');
    navigate('/mypage');
  };

  return (
    <LoginLayout title={<h1 className="text-2xl font-bold text-center">비밀번호 변경</h1>}>
      <form onSubmit={handleSubmitChangePassword} className="space-y-4">
        <PasswordInput
          label="현재 비밀번호"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호를 입력하세요"
        />

        {/* 새 비밀번호 입력 */}
        <PasswordInput
          name="password"
          label="새 비밀번호"
          placeholder="새 비밀번호를 입력하세요"
          value={password}
          isNewPassword={true}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 비밀번호 확인 입력 */}
        <PasswordInput
          name="confirmPassword"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" variant="primary" className="w-full  bg-purple-600">
          비밀번호 변경
        </Button>
      </form>
    </LoginLayout>
  );
};

export default ChangePassword;
