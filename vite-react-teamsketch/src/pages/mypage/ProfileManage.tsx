import { useState } from 'react';

import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { axiosInstance } from '../../services/api/axiosInstance';
import { apiConfig } from '../../services/api/apiConfig';
import { setUser } from '../../store/slices/userSlice';

import BaseInput from '../../components/common/BaseInput';
import BaseButton from '../../components/common/BaseButton';
import InterestSelect from '../../components/forms/select/InterestSelect';
import HobbySelect from '../../components/forms/select/HobbySelect';
import BaseLabelBox from '../../components/common/BaseLabelBox';
import ImageUpload from '../../components/features/upload/ImageUpload';
import { coreProfile } from '../../services/api/imageAPI';
import ProfileManageLayout from '../../components/layout/ProfileManageLayout';
import TextAreaInput from '../../components/forms/textarea/TextAreaInput';
import { useNavigate } from 'react-router-dom';

interface UserHobby {
  hobbyId: number;
  categoryId: number;
}

interface ProfileUpdateRequest {
  name: string;
  nickname: string;
  bio: string;
  hobbies: UserHobby[];
}

const ProfileManage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    user.hobby?.[0]?.categoryId
  );

  const [selectedHobbies, setSelectedHobbies] = useState<UserHobby[]>(
    user.hobby?.map(({ hobbyId, categoryId }) => ({ hobbyId, categoryId })) || []
  );

  const [error, setError] = useState<string>('');

  // 입력 핸들러 통합
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setUser({ ...user, [name]: value }));
    console.log(user);
  };

  const handleInterestSelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    // 카테고리 변경 시 모든 이전 선택 초기화
    setSelectedHobbies([]);
  };

  const handleHobbySelect = (categoryId: number, hobbyId: number) => {
    // 새로운 취미 선택 시 이전 선택은 모두 제거하고 현재 선택만 유지
    setSelectedHobbies([{ categoryId, hobbyId }]);
    console.log('현재 선택된 취미:', { categoryId, hobbyId });
  };

  const handleSave = async () => {
    try {
      const updateData: ProfileUpdateRequest = {
        name: user.name,
        nickname: user.nickname,
        bio: user.bio || '',
        hobbies: selectedHobbies.length > 0 ? selectedHobbies : []
      };

      console.log('프로필 업데이트 요청 데이터:', updateData);

      const response = await axiosInstance.put(apiConfig.endpoints.core.updateProfile, updateData);

      console.log('프로필 업데이트 응답:', response.data);

      if (response.data.success === true) {
        // updatedProfile에서 데이터를 가져오도록 수정
        const updatedProfile = response.data.updatedProfile;

        dispatch(
          setUser({
            ...user,
            name: updatedProfile.name,
            nickname: updatedProfile.nickname,
            bio: updatedProfile.bio,
            hobby: updatedProfile.hobbies.map((hobby: any) => ({
              hobbyId: hobby.hobbyId,
              hobbyName: hobby.hobbyName,
              categoryId: hobby.categoryId,
              categoryName: hobby.categoryName
            }))
          })
        );

        setSelectedHobbies(
          updatedProfile.hobbies.map((hobby: any) => ({
            hobbyId: hobby.hobbyId,
            categoryId: hobby.categoryId
          }))
        );

        navigate('/mypage');
      } else {
        throw new Error(response.data.message || '프로필 수정에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 수정 중 오류가 발생했습니다.');
      console.error('프로필 수정 에러:', err);
    }
  };

  return (
    <ProfileManageLayout
      error={error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
      image={
        <ImageUpload
          onUpload={coreProfile}
          className="max-w-md mx-auto"
          type="profile"
          isEdit={true}
          currentImage={user.profileImagePath instanceof File ? user.profileImagePath : null}
        />
        
      }
      email={user.email || 'test@test.com'}
      userInfoName={
        <BaseLabelBox label="이름">
          <BaseInput
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            className="border-primary-500"
          />
        </BaseLabelBox>
      }
      userInfoNickname={
        <BaseLabelBox label="닉네임">
          <BaseInput
            name="nickname"
            value={user.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            className="border-primary-500"
          />
        </BaseLabelBox>
      }
      userInfoBio={
        <BaseLabelBox label="소개글">
          <TextAreaInput
            inputType="bio"
            name="bio"
            value={user.bio || ''}
            onChange={handleChange}
            placeholder="소개글을 입력하세요"
            className="border-primary-500"
          />
        </BaseLabelBox>
      }
      userInfoInterest={
        <BaseLabelBox label="관심사">
          <InterestSelect
            onInterestSelect={handleInterestSelect}
            selectedCategory={selectedCategoryId}
          />
        </BaseLabelBox>
      }
      userInfoHobby={
        <BaseLabelBox label="취미">
          <HobbySelect
            onHobbySelect={handleHobbySelect}
            selectedHobbies={selectedHobbies}
            categoryId={selectedCategoryId}
          />
        </BaseLabelBox>
      }
      saveButton={
        <BaseButton variant="primary" buttonSize="lg" onClick={handleSave} className="w-full">
          수정
        </BaseButton>
      }
    />
  );
};

export default ProfileManage;
