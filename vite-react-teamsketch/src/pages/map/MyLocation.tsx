import OpenMap from '../../components/features/location/OpenMap';
import SearchLocation from '../../components/features/location/SearchLocation';
import LocationInfo from '../../components/features/location/LocationInfo';
import LocationLayout from '../../components/layout/LocationLayout';
import BaseButton from '../../components/common/BaseButton';
import { useNavigate } from 'react-router-dom';
import { saveLocationApi } from '../../services/api/authAPI';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setMyLocation } from '../../store/slices/mapSlice';
import { useState } from 'react';
import Loading from '../../components/common/Loading';
import { RootState } from '../../store/store';




// map 슬라이스에서 선택된 위치 위도경도를 받아와서 api 호출
// 사용자 위치 등록 로그인 후 이동되는 페이지
const MyLocation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const myLocation = useSelector((state: RootState) => state.map.myLocation);

  const handleLocationConfirm = async () => {
    setIsLoading(true);
    try {
      console.log('위치 선택 완료');
      if (myLocation.lat !== 0 && myLocation.lng !== 0) {
        const response = await saveLocationApi({
          latitude: myLocation.lat,
          longitude: myLocation.lng,
        });

        if (response.status === 'success') {
          dispatch(setMyLocation(response.data));
          toast.success('위치 업데이트 완료');
          navigate('/');
        } else {
          toast.error('위치 업데이트 실패');
        }
      } else {
        toast.error('위도와 경도를 선택해주세요.');
      }
    } catch (error: any) {
      toast.error('위치 선택이 잘못되었습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 flex flex-col">
      <LocationLayout
        childrenTop={<SearchLocation onLocationSelect={() => { }} />}
        childrenCenter={<OpenMap nonClickable={false} />}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loading />
              </div>
            ) : (
              <span>나의 위치 설정하기</span>
            )}
          </BaseButton>
        }
      ></LocationLayout>
    </div>
  );
};

export default MyLocation;
