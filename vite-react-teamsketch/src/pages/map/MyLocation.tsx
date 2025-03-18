import OpenMap from '../../components/features/location/OpenMap';
import SearchLocation from '../../components/features/location/SearchLocation';
import LocationInfo from '../../components/features/location/LocationInfo';
import LocationLayout from '../../components/layout/LocationLayout';
import BaseButton from '../../components/common/BaseButton';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

// 사용자 위치 등록 로그인 후 이동되는 페이지
const MyLocation = () => {
  const navigate = useNavigate();
  
  // 첫 로그인 여부 확인 (위치 설정 유무로 판단)
  const isFirstLogin = useMemo(() => {
    const token = localStorage.getItem('token');
    const locationSet = localStorage.getItem('locationSet');
    return token && !locationSet;
  }, []);
  
  const handleLocationConfirm = () => {
    // 위치 선택 완료 시 localStorage에 플래그 설정
    localStorage.setItem('locationSet', 'true');
    
    // api호출
    console.log('위치 선택 완료');
    navigate('/');
  };
  
  return (
    <div 
      className={`w-full bg-white dark:bg-gray-800 flex flex-col h-screen ${!isFirstLogin ? 'pb-12' : ''}`}
    >
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
              className="w-full rounded-none pb-8"
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
