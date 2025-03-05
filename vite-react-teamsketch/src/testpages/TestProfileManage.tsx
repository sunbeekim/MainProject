import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';
import TestProfileManageLayout from './TestProfileManageLayout';

const TestProfileManage = () => {
  const user = useAppSelector((state: RootState) => state.user.user);

  const [formData, setFormData] = useState({
    name: user.name || '지우',
    nickname: user.nickname || '피카츄',
    bio: user.bio || '안녕하세요! 반가워요! 다음다롱다운입니다!',
    interest: '',
    hobby: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interest: value
    }));
  };

  const handleHobbySelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      hobby: value
    }));
  };

  const handleSave = async () => {
    try {
      // 여기에 저장 로직 구현
      console.log('저장할 데이터:', formData);
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // 프로필 이미지 업데이트 로직 구현
      console.log('프로필 이미지 업데이트');
    } catch (error) {
      console.error('프로필 이미지 업데이트 실패:', error);
    }
  };

  return (
    <div className="h-full">
      <TestProfileManageLayout
        email={user.email}
        profileImagePath={user.profileImagePath}
        onProfileUpdate={handleProfileUpdate}
        onInputChange={handleInputChange}
        onInterestSelect={handleInterestSelect}
        onHobbySelect={handleHobbySelect}
        onSave={handleSave}
        formData={formData}
      />
    </div>
  );
};

export default TestProfileManage;
