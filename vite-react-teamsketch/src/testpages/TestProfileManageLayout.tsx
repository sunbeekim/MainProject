import Grid from '../components/common/Grid';
import GridItem from '../components/common/GridItem';

interface TestProfileManageLayoutProps {
    email?: string;
    image: React.ReactNode;
    userInfoName: React.ReactNode;
    userInfoNickname: React.ReactNode;
    userInfoBio: React.ReactNode;
    userInfoInterest: React.ReactNode;
    userInfoHobby: React.ReactNode;
    saveButton: React.ReactNode;
};


const TestProfileManageLayout = ({
    email = 'test@test.com',
    image,
    userInfoName,
    userInfoNickname,
    userInfoBio,
    userInfoInterest,
    userInfoHobby,
    saveButton,
}: TestProfileManageLayoutProps) => {
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 overflow-y-auto">
      <div className="min-h-full flex flex-col">
        <Grid cols={1} gap="sm" className="flex-1 p-3 sm:p-4 lg:p-8">
          {/* 프로필 이미지 섹션 */}
          <GridItem>
            <div className="flex flex-col items-center gap-4">
              {image}
              {email}
            </div>
           
          </GridItem>

          {/* 기본 정보 섹션 */}
          <GridItem>
            <div className="space-y-4 max-w-2xl mx-auto w-full">
              
              {userInfoName}
              {userInfoNickname}
              {userInfoBio}
              
              {/* 관심사 및 취미 섹션 */}
              <Grid cols={2} gap="sm">
                <GridItem>
                  {userInfoInterest}
                </GridItem>
                <GridItem>
                  {userInfoHobby}
                </GridItem>
              </Grid>
              
            </div>
          </GridItem>
        </Grid>

        {/* 저장 버튼 - 항상 하단에 고정 */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-2xl mx-auto">
            {saveButton}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProfileManageLayout;
