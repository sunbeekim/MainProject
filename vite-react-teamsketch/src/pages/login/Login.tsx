import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useLogin } from '../../services/api/authService';
import Loading from '../../components/common/Loading';


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
    <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-8">
            <h1 className="text-center text-2xl font-bold">로그인</h1>
            
        {error && (
          <div className="text-red-500 text-sm text-center" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            className="w-full rounded-lg border p-2 text-gray-900 dark:text-white dark:bg-gray-800"
            required
            data-testid="email-input"
          />
        </div>

        <div className="space-y-2">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="w-full rounded-lg border p-2 text-gray-900 dark:text-white dark:bg-gray-800"
            required
            data-testid="password-input"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          data-testid="login-button"
        >
          로그인
        </button>
        <button
          type="submit"
          className="w-full bg-primary-light text-white py-2 rounded-lg hover:bg-primary-dark"
          data-testid="login-button"
          onClick={() => navigate('/signup')}
        >
          회원가입
        </button>
        <Loading />
        </form>     
    </div>
  );
};

export default Login;