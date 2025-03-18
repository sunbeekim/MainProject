import OpenMap from '../../components/features/location/OpenMap';
import SearchLocation from '../../components/features/location/SearchLocation';
import LocationInfo from '../../components/features/location/LocationInfo';
import LocationLayout from '../../components/layout/LocationLayout';
import BaseButton from '../../components/common/BaseButton';
import { useNavigate } from 'react-router-dom';
// map 슬라이스에서 선택된 위치 위도경도를 받아와서 api 호출
// 사용자 위치 등록 로그인 후 이동되는 페이지
const MyLocation = () => {
  const navigate = useNavigate();
  const handleLocationConfirm = () => {
    console.log('위치 선택 완료');
    navigate('/');
  };
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 flex flex-col">
      <LocationLayout
        childrenTop={<SearchLocation onLocationSelect={() => {}} />}
        childrenCenter={<OpenMap nonClickable={false}/>}
        childrenBottom={
          <LocationInfo
            showEndLocation={false}
            showMyLocation={true}
            showYourLocation={false}
            
          />
        }
        childrenButton={
            <BaseButton
              variant="primary"
              className="w-full rounded-none"
              onClick={handleLocationConfirm}
            >
              나의 위치 설정하기
            </BaseButton>
          }
      ></LocationLayout>
    </div>
  );
};

export default MyLocation;
