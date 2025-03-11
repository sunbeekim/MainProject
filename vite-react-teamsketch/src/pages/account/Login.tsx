import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { setUser } from '../../store/slices/userSlice';
import type { LoginRequest } from '../../types/auth';
import { useLogin, useInfoApi } from '../../services/api/authAPI';
import LoginLayout from '../../components/layout/LoginLayout';
import Button from '../../components/common/BaseButton';
import Loading from '../../components/common/Loading';
import { google, kakao, naver } from '../../assets/images/login';
import EmailInput from '../../components/forms/input/EmailInput';
import LoginPasswordInput from '../../components/forms/input/LoginPasswordInput';
import { validateEmail, validatePassword } from '../../utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = useLogin();
  const userData = useInfoApi();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleLogin = async (loginData: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await loginMutation.mutateAsync(loginData);

      if (response.status === 'success' && response.data) {
        // 1. 로그인 성공 시 토큰과 기본 정보 저장
        dispatch(
          login({
            email: response.data.email || '',
            nickname: response.data.nickname || '',
            userId: response.data.id || 0,
            token: response.data.token || ''
          })
        );

        const userinfo = await userData.mutateAsync();
        console.log('사용자 정보:', userinfo.data);

        // 2. 사용자 정보를 userSlice에 저장
        dispatch(
          setUser({
            id: userinfo.data.id || 0,
            email: userinfo.data.email || '',
            name: userinfo.data.name || '',
            nickname: userinfo.data.nickname || '',
            phoneNumber: userinfo.data.phoneNumber || null,
            bio: userinfo.data.bio || null,
            loginMethod: userinfo.data.loginMethod || 'EMAIL',
            socialProvider: userinfo.data.socialProvider || 'NONE',
            accountStatus: userinfo.data.accountStatus || 'Active',
            authority: userinfo.data.authority || 'USER',
            profileImagePath: null,
            signupDate: userinfo.data.signupDate || '',
            lastUpdateDate: userinfo.data.lastUpdateDate || '',
            lastLoginTime: userinfo.data.lastLoginTime || null,
            loginFailedAttempts: 0,
            loginIsLocked: false,
            interest: userinfo.data.hobbies?.map((hobby: any) => hobby.categoryName) || [],
            hobby:
              userinfo.data.hobbies?.map((hobby: any) => ({
                hobbyId: hobby.hobbyId,
                hobbyName: hobby.hobbyName,
                categoryId: hobby.categoryId,
                categoryName: hobby.categoryName
              })) || []
          })
        );

        navigate('/');
      } else {
        throw new Error(response || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? (err as any).response.data.data.message : '로그인 중 오류가 발생했습니다.'
      );
      console.error('로그인 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // 실시간 유효성 검사
    let validationResult = { isValid: true, message: '' };
    if (name === 'email') {
      validationResult = validateEmail(value);
    } else if (name === 'password') {
      validationResult = validatePassword(value);
    }

    setValidationErrors((prev) => ({
      ...prev,
      [name]: validationResult.message
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 입력값 유효성 검사
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    setValidationErrors({
      email: emailValidation.message,
      password: passwordValidation.message
    });

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    await handleLogin(formData);
  };

  return (
    <>
      {isLoading && <Loading />}
      <form
        className="h-full w-full bg-white dark:bg-gray-800 flex flex-col"
        onSubmit={handleSubmit}
      >
        <LoginLayout
          title={<h1 className="text-2xl font-bold">Haru, 함께 하는 즐거움!</h1>}
          forgotPassword={
            <a
              href="/forgotpassword"
              className="text-sm text-primary-light hover:text-primary-dark"
            >
              비밀번호 찾기
            </a>
          }
          loginButton={
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              data-testid="login-button"
              disabled={isLoading}
            >
              {isLoading ? <Loading /> : '로그인'}
            </Button>
          }
          divider={
            <div className="relative my-6 h-px bg-gray-300 dark:bg-gray-700">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 text-sm text-gray-500">
                or
              </span>
            </div>
          }
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
            data-testid="email-input"
            disabled={isLoading}
            error={validationErrors.email}
          />
          <LoginPasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            data-testid="password-input"
            disabled={isLoading}
            error={validationErrors.password}
          />
        </LoginLayout>
        {error && (
          <div className="text-red-500 text-sm text-center mt-2" role="alert">
            {error}
          </div>
        )}
      </form>
    </>
  );
};

export default Login;
