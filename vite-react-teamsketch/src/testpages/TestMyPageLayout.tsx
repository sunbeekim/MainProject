import Grid from '../components/common/Grid';
import GridItem from '../components/common/GridItem';
import BaseButton from '../components/common/BaseButton';
import ProfileSelector from '../components/features/upload/ProfileSelector';
import { FaUserCog, FaBoxOpen, FaCreditCard, FaHistory, FaHeadset } from 'react-icons/fa';

interface TestMyPageLayoutProps {
  email?: string;
  nickname?: string;
  profileImagePath?: File | null;
  followerCount?: number;
  point?: number;
  dopamine?: number;
  onProfileUpdate?: () => void;
}

const TestMyPageLayout = ({
  email,
  nickname,
  profileImagePath,
  followerCount,
  point,
  dopamine,
  onProfileUpdate
}: TestMyPageLayoutProps) => {
  followerCount = 326;
  point = 1200;
  dopamine = 85;

  const menuItems = [
    {
      icon: <FaUserCog size={20} />,
      label: '프로필 관리',
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/30'
    },
    {
      icon: <FaBoxOpen size={20} />,
      label: '상품 관리',
      color: 'hover:bg-purple-50 dark:hover:bg-purple-900/30'
    },
    {
      icon: <FaCreditCard size={20} />,
      label: '결제 수단',
      color: 'hover:bg-green-50 dark:hover:bg-green-900/30'
    },
    {
      icon: <FaHistory size={20} />,
      label: '거래 내역',
      color: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
    },
    {
      icon: <FaHeadset size={20} />,
      label: '고객 센터',
      color: 'hover:bg-pink-50 dark:hover:bg-pink-900/30'
    }
  ];

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800">
      <Grid cols={1} className="p-4 gap-6">
        {/* 프로필 이미지 */}
        <GridItem>
          <div className="flex justify-center px-4">
            <ProfileSelector
              file={profileImagePath as File}
              onFileSelect={onProfileUpdate}
              isEditable={false}
            />
          </div>
        </GridItem>

        {/* 사용자 기본 정보 */}
        <GridItem>
          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              {email ? email : '홍길동@example.com'}
            </p>
            <p className="text-xl font-semibold">{nickname ? nickname : 'OooO'}</p>
          </div>
        </GridItem>

        {/* 통계 정보 */}
        <GridItem>
          <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">팔로워</p>
              <p className="text-lg font-bold text-primary">{followerCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">포인트</p>
              <p className="text-lg font-bold text-primary">{point}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">도파민</p>
              <p className="text-lg font-bold text-primary">{dopamine}</p>
            </div>
          </div>
        </GridItem>

        {/* 메뉴 버튼들 */}
        <GridItem>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <BaseButton
                key={index}
                variant="outline"
                className={`
                  w-full py-4 px-6
                  flex items-center justify-between
                  rounded-xl
                  transition-all duration-300
                  border border-gray-100 dark:border-gray-700
                  bg-white dark:bg-gray-800
                  ${item.color}
                  group
                `}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="text-gray-400 dark:text-gray-500 
                    group-hover:text-primary dark:group-hover:text-primary-light 
                    transition-colors duration-300"
                  >
                    {item.icon}
                  </div>
                  <span
                    className="font-medium text-gray-700 dark:text-gray-300
                    group-hover:text-primary dark:group-hover:text-primary-light"
                  >
                    {item.label}
                  </span>
                </div>
                <div
                  className="text-gray-400 dark:text-gray-500 
                  group-hover:text-primary dark:group-hover:text-primary-light 
                  group-hover:transform group-hover:translate-x-1 
                  transition-all duration-300"
                >
                  →
                </div>
              </BaseButton>
            ))}
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default TestMyPageLayout;
