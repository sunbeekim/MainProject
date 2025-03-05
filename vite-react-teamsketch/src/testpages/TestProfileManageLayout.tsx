import Grid from '../components/common/Grid';
import GridItem from '../components/common/GridItem';
import BaseLabelBox from '../components/common/BaseLabelBox';
import ImageUpload from '../components/features/upload/ImageUpload';
import TextInput from '../components/forms/input/TextInput';
import InterestSelect from '../components/forms/select/InterestSelect';
import BaseButton from '../components/common/BaseButton';

interface TestProfileManageLayoutProps {
  email?: string;
  profileImagePath?: File | null;
  onProfileUpdate?: () => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInterestSelect?: (value: string) => void;
  onHobbySelect?: (value: string) => void;
  onSave?: () => void;
  formData: {
    name: string;
    nickname: string;
    bio: string;
    interest: string;
    hobby: string;
  };
}

const TestProfileManageLayout = ({
  email,
  profileImagePath,
  onProfileUpdate,
  onInputChange,
  onInterestSelect,
  onHobbySelect,
  onSave,
  formData
}: TestProfileManageLayoutProps) => {
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 overflow-y-auto">
      <div className="min-h-full flex flex-col">
        <Grid cols={1} gap="sm" className="flex-1 p-3 sm:p-4 lg:p-8">
          {/* 프로필 이미지 섹션 */}
          <GridItem>
            <div className="flex flex-col items-center gap-4">
              <ImageUpload
                type="profile"
                currentImage={profileImagePath}
                onUpload={async () => {
                  try {
                    await onProfileUpdate?.();
                  } catch (error) {
                    console.error('프로필 이미지 업로드 실패:', error);
                  }
                }}
              />
            </div>
          </GridItem>

          {/* 기본 정보 섹션 */}
          <GridItem>
            <div className="space-y-4 max-w-2xl mx-auto w-full">
              <BaseLabelBox label="이메일">
                <TextInput
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
              </BaseLabelBox>
              <BaseLabelBox label="이름">
                <TextInput
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="이름을 입력하세요"
                />
              </BaseLabelBox>
              <BaseLabelBox label="닉네임">
                <TextInput
                  name="nickname"
                  value={formData.nickname}
                  onChange={onInputChange}
                  placeholder="닉네임을 입력하세요"
                />
              </BaseLabelBox>
              <BaseLabelBox label="소개글">
                <TextInput
                  name="bio"
                  value={formData.bio}
                  onChange={onInputChange}
                  placeholder="자신을 소개해주세요"
                />
              </BaseLabelBox>
              
              
              {/* 관심사 및 취미 섹션 */}
              <Grid cols={2} gap="sm">
                <GridItem>
                  <BaseLabelBox label="관심사">
                    <InterestSelect
                      onInterestSelect={onInterestSelect || (() => {})}
                      selectedInterest={formData.interest}
                    />
                  </BaseLabelBox>
                </GridItem>
                <GridItem>
                  <BaseLabelBox label="취미">
                    <InterestSelect
                      onInterestSelect={onHobbySelect || (() => {})}
                      selectedInterest={formData.hobby}
                    />
                  </BaseLabelBox>
                </GridItem>
              </Grid>
              
            </div>
          </GridItem>
        </Grid>

        {/* 저장 버튼 - 항상 하단에 고정 */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-2xl mx-auto">
            <BaseButton
              variant="primary"
              buttonSize="lg"
              onClick={onSave}
              className="w-full"
            >
              변경하기
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProfileManageLayout;
