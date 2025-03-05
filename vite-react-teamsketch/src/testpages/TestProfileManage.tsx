import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Grid from '../components/common/Grid';
import GridItem from '../components/common/GridItem';
import BaseInput from '../components/common/BaseInput';
import BaseButton from '../components/common/BaseButton';

import InterestSelect from '../components/forms/select/InterestSelect';
import BaseLabelBox from '../components/common/BaseLabelBox';
import ImageUpload from '../components/features/upload/ImageUpload';
import { fileUpload } from '../services/api/testAPI';

const TestProfileManage = () => {
  const { email, nickname } = useSelector((state: RootState) => state.auth.user);
  const { profileImagePath } = useSelector((state: RootState) => state.user.user);
  const [formData, setFormData] = useState({
    nickname: nickname || '',
    phoneNumber: '',
    interest: '',
    hobby: ''
  });

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
    <div className="h-full w-full bg-white dark:bg-gray-800">
      <Grid cols={1} className="p-4 gap-6">
        {/* 타이틀 */}
        <GridItem>
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            프로필 관리
          </h1>
        </GridItem>

        {/* 프로필 이미지 섹션 */}
        <GridItem>
          <div className="flex flex-col items-center gap-4">
            <ImageUpload
              onUpload={fileUpload.coreProfile}
              className="max-w-md mx-auto"
              type="profile"
              currentImage={profileImagePath as File | null}
            />
          </div>
          <div className="text-center mt-2 text-gray-600 dark:text-gray-400">{email}</div>
        </GridItem>

        {/* 기본 정보 섹션 */}
        <GridItem>
          <div className="space-y-4">
            <BaseLabelBox label="닉네임">
              <BaseInput
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="닉네임을 입력하세요"
              />
            </BaseLabelBox>

            <BaseLabelBox label="전화번호">
              <BaseInput
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="전화번호를 입력하세요"
              />
            </BaseLabelBox>
          </div>
        </GridItem>

        {/* 관심사 및 취미 섹션 */}
        <GridItem>
          <div className="grid grid-cols-2 gap-4">
            <BaseLabelBox label="관심사">
              <InterestSelect
                onInterestSelect={handleInterestSelect}
                selectedInterest={formData.interest}
              />
            </BaseLabelBox>

            <BaseLabelBox label="취미">
              <InterestSelect
                onInterestSelect={handleHobbySelect}
                selectedInterest={formData.hobby}
              />
            </BaseLabelBox>
          </div>
        </GridItem>

        {/* 저장 버튼 */}
        <GridItem>
          <BaseButton variant="primary" className="w-full py-4 rounded-xl" onClick={handleSave}>
            저장하기
          </BaseButton>
        </GridItem>
      </Grid>
    </div>
  );
};

export default TestProfileManage;
