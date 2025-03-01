import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateField, setValidationError, setError } from '../../store/slices/signupSlice';

import SignupLayout from '../../components/layout/SignupLayout';
import Button from '../../components/common/BaseButton';
import {
  validateName,
  validateId,
  validatePassword,
  validateEmail,
  validatePhone,
  validateNickname
} from '../../utils/validation';
import Grid from '../../components/common/Grid';
import TextInput from '../../components/forms/input/TextInput';
import PasswordInput from '../../components/forms/input/PasswordInput';
import EmailInput from '../../components/forms/input/EmailInput';
import { useSignup } from '../../services/api/authService';

interface SignupForm {
  name: string;
  id: string;
  password: string;
  email: string;
  phone: string;
  nickname: string;
  hobby?: string;
}

const Signup = () => {
  const signupMutation = useSignup();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { formData, validationErrors, error } = useAppSelector((state) => state.signup);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));

    let validationResult = { isValid: true, message: '' };
    switch (name) {
      case 'name':
        validationResult = validateName(value);
        break;
      case 'id':
        validationResult = validateId(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'phone':
        validationResult = validatePhone(value);
        break;
      case 'nickname':
        validationResult = validateNickname(value);
        break;
    }

    dispatch(setValidationError({ field: name, message: validationResult.message }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setError(''));

    try {
      // 모든 필수 필드 검증
      const requiredFields = ['name', 'id', 'password', 'email', 'phone', 'nickname'];
      const missingFields = requiredFields.filter((field) => !formData[field as keyof SignupForm]);

      if (missingFields.length > 0) {
        dispatch(setError('모든 필수 항목을 입력해주세요.'));
        return;
      }

      // 유효성 검사 에러가 있는지 확인
      const hasValidationErrors = Object.values(validationErrors).some((error) => error);
      if (hasValidationErrors) {
        dispatch(setError('입력 형식을 확인해주세요.'));
        return;
      }

      await signupMutation.mutateAsync(formData);
      navigate('/login');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SignupLayout
        title={<h1 className="text-2xl font-bold">회원가입</h1>}
        signupButton={
          <Button type="submit" variant="primary" className="w-full">
            회원가입
          </Button>
        }
        divider={<div className="relative my-6 h-px bg-gray-300 dark:bg-gray-700" />}
        loginSection={
          <div className="text-sm">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-light hover:text-primary-dark"
            >
              로그인
            </button>
          </div>
        }
      >
        {error && (
          <div className="text-red-500 text-sm text-center mt-2" role="alert">
            {error}
          </div>
        )}
        <Grid cols={2} gap="sm">
          <TextInput
            label="이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
          />
          <TextInput
            label="아이디"
            name="id"
            value={formData.id}
            onChange={handleChange}
            error={validationErrors.id}
          />
        </Grid>

        <PasswordInput
          label="비밀번호"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
        />

        <EmailInput
          label="이메일"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={validationErrors.email}
        />

        <TextInput
          label="전화번호"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={validationErrors.phone}
        />

        <Grid cols={2} gap="sm">
          <TextInput label="취미" name="hobby" value={formData.hobby} onChange={handleChange} />
          <TextInput
            label="닉네임"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            error={validationErrors.nickname}
          />
        </Grid>
      </SignupLayout>
    </form>
  );
};

export default Signup;
