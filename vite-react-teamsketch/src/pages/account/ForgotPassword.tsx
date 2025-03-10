import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginLayout from '../../components/layout/LoginLayout';
import Button from '../../components/common/BaseButton';
import EmailInput from '../../components/forms/input/EmailInput';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('입력된 이메일:', email);

    navigate('/verify-method');
  };

  return (
    <LoginLayout
      title={<h1 className="text-2xl font-bold text-center">비밀번호 찾기</h1>}
      signupLink={
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-primary-light hover:text-primary-dark text-sm"
        >
          로그인으로 돌아가기
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 text-center">
          비밀번호를 찾고자하는 이메일을 입력해주세요.
        </p>
        <EmailInput
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
        />
        <Button type="submit" variant="primary" className="w-full">
          다음
        </Button>
      </form>
    </LoginLayout>
  );
};

export default ForgotPassword;
