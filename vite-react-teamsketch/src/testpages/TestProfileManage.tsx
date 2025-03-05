import { useState} from 'react';

import { RootState } from '../store/store';
import { useAppSelector } from '../store/hooks';

import BaseInput from '../components/common/BaseInput';
import BaseButton from '../components/common/BaseButton';
import TextInput from '../components/forms/input/TextInput';
import InterestSelect from '../components/forms/select/InterestSelect';
import BaseLabelBox from '../components/common/BaseLabelBox';
import ImageUpload from '../components/features/upload/ImageUpload';
import { fileUpload } from '../services/api/testAPI';
import TestProfileManageLayout from './TestProfileManageLayout';

const TestProfileManage = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
 

  const [formData, setFormData] = useState({
    name: user.name || '지우',
    nickname: user.nickname || '피카츄',
    phoneNumber: user.phoneNumber || '01012345678',
    interest: '',
    hobby: '',
    bio: user.bio || '안녕하세요! 반가워요! 다음다롱다운입니다!'
  });

  console.log('유저 정보:', user);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interest: value
    }));
  };

  const handleHobbySelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      hobby: value
    }));
  };

  const handleSave = () => {
    // 저장 로직 구현
    console.log('저장된 데이터:', { ...formData });
  };

  return (
    <TestProfileManageLayout
      image={
        <ImageUpload
          onUpload={fileUpload.coreProfile}
          className="max-w-md mx-auto"
          type="profile"
          isEdit={true} 
          currentImage={user.profileImage instanceof File ? user.profileImage : null} 
        />
      }
      userInfoName={
        <BaseLabelBox label="이름">
          <BaseInput
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            placeholder="이름을 입력하세요"
          />
        </BaseLabelBox>
      }
      userInfoNickname={
        <BaseLabelBox label="닉네임">
          <BaseInput
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}  
            placeholder="닉네임을 입력하세요"
          />
        </BaseLabelBox>
      }
      userInfoBio={
        <BaseLabelBox label="소개글">
          <TextInput
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="소개글을 입력하세요"
          />  
        </BaseLabelBox>
      }
      userInfoInterest={
        <BaseLabelBox label="관심사">
          <InterestSelect
            onInterestSelect={handleInterestSelect}
            selectedInterest={formData.interest}
          />
        </BaseLabelBox>
      }
      userInfoHobby={
        <BaseLabelBox label="취미"> 
          <InterestSelect
            onInterestSelect={handleHobbySelect}
            selectedInterest={formData.hobby}
          />
        </BaseLabelBox>
      } 
      saveButton={
        <BaseButton
          
          variant="primary"
          buttonSize="lg"
          onClick={handleSave}
          className="w-full"  
        >수정</BaseButton>
      }
    />
  );
};

export default TestProfileManage;
