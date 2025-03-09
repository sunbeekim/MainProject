import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateField, setValidationError, setError } from '../../store/slices/signupSlice';

import SignupLayout from '../../components/layout/SignupLayout';
import Button from '../../components/common/BaseButton';
import {
  validateName,
  validatePassword,
  validateEmail,
  validatePhone,
  validateNickname
} from '../../utils/validation';

import TextInput from '../../components/forms/input/TextInput';
import PasswordInput from '../../components/forms/input/PasswordInput';
import EmailInput from '../../components/forms/input/EmailInput';
import InterestSelect from '../../components/forms/select/InterestSelect';
import { useSignup } from '../../services/api/authAPI';
import { SignupForm } from '../../types/auth';
import HobbySelect from '../../components/forms/select/HobbySelect';

const Signup = () => {
  const signupMutation = useSignup();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { formData, validationErrors, error } = useAppSelector((state) => state.signup);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ name: name as keyof SignupForm, value }));

    let validationResult = { isValid: true, message: '' };
    switch (name) {
      case 'name':
        validationResult = validateName(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'phoneNumber':
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
      const requiredFields = ['name', 'password', 'email', 'phoneNumber', 'nickname'];
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

      await signupMutation.mutateAsync({
        name: formData.name,
        password: formData.password,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        nickname: formData.nickname,
        hobby: formData.hobby,
        extraHobby:formData.extraHobby,
        bio: formData.bio,
        loginMethod: 'EMAIL',
        socialProvider: null
      });
      navigate('/login');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.'));
    }
  };

  const handleInterestSelect = (value: string) => {
    dispatch(updateField({ name: 'hobby', value }));
  };
  const handleHobbySelect = (value: string) => {
    dispatch(updateField({ name: 'extraHobby', value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <SignupLayout
        title={<h1 className="text-xl font-bold">어서오세요. 환영합니다!</h1>}
        signupButton={
          <Button type="submit" variant="primary" className="w-full py-2.5 text-sm sm:text-base">
            회원가입
          </Button>
        }
        divider={<div className="relative h-px bg-gray-300 dark:bg-gray-700 w-full" />}
        loginSection={
          <div className="text-sm">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-light hover:text-primary-dark font-medium"
            >
              로그인
            </button>
          </div>
        }
      >
        {error && (
          <div className="text-red-500 text-sm text-center mb-2" role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <EmailInput
            label="이메일"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
          />

          <PasswordInput
            label="비밀번호"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={validationErrors.password}
          />

          <TextInput
            label="이름"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
          />

          <TextInput
            label="전화번호"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={validationErrors.phoneNumber}
          />

          <TextInput
            label="닉네임"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            error={validationErrors.nickname}
          />
<div className="flex flex-row gap-3">
          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-sm font-medium text-gray-700">관심사</label>
            <InterestSelect
              onInterestSelect={handleInterestSelect}
              selectedInterest={formData.hobby || ''}
            />
          </div>

          <div className="flex flex-col gap-1 w-1/2">
            <label className="text-sm font-medium text-gray-700">취미</label>
            <HobbySelect
              onHobbySelect={handleHobbySelect}
              selectedExtraHobby={formData.extraHobby || ''}
            />
            </div>
            </div>
        </div>
      </SignupLayout>
    </form>
  );
};

export default Signup;
