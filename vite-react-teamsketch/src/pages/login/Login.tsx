import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useLogin } from '../../services/api/authService';
import LoginLayout from '../../components/layout/LoginLayout';
import Button from '../../components/common/BaseButton';
import Loading from '../../components/common/Loading';
import { google, kakao, naver } from '../../assets/images/login';
import EmailInput from '../../components/forms/input/EmailInput';
import LoginPasswordInput from '../../components/forms/input/LoginPasswordInput';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await loginMutation.mutateAsync(formData);
      dispatch(login(user));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LoginLayout
        title={<h1 className="text-2xl font-bold">로그인</h1>}
        forgotPassword={
          <a href="/forgot-password" className="text-sm text-primary-light hover:text-primary-dark">
            비밀번호 찾기
          </a>
        }
        loginButton={
          <Button
            type='submit'
            variant="primary"
            className="w-full"
            data-testid="login-button"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <Loading /> : '로그인'}
          </Button>
        }
        divider={<div className="relative my-6 h-px bg-gray-300 dark:bg-gray-700">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 text-sm text-gray-500">
            or
          </span>
        </div>}
        socialLogins={
          <div className="flex justify-center items-center gap-6">
            <button type="button" className="w-20 h-20 hover:opacity-80 transition-opacity">
              <img src={google} alt="구글 로그인" className="w-full h-full object-contain" />
            </button>
            <button type="button" className="w-20 h-20 hover:opacity-80 transition-opacity">
              <img src={kakao} alt="카카오 로그인" className="w-full h-full object-contain" />
            </button>
            <button type="button" className="w-20 h-20 hover:opacity-80 transition-opacity">
              <img src={naver} alt="네이버 로그인" className="w-full h-full object-contain" />
            </button>            
          </div>
        }
        signupLink={
          <div className="text-sm">
            아직 회원이 아니신가요?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-primary-light hover:text-primary-dark"
            >
              회원가입
            </button>
          </div>
        }
      >
        <EmailInput
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일"
          testId="email-input"
        />
        <LoginPasswordInput
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호"
          testId="password-input"
        />
      </LoginLayout>
      {error && (
        <div className="text-red-500 text-sm text-center mt-2" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default Login;