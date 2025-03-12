import Grid from '../../common/Grid';
import GridItem from '../../common/GridItem';
import { ILocation } from '../../../types/map';
import { useDispatch, useSelector } from 'react-redux';
import { setMyLocation, setEndLocation } from '../../../store/slices/mapSlice';
import { useEffect } from 'react';
import { RootState } from '../../../store/store';
import { getAddressFromCoords } from '../../../services/third-party/myLocation';

interface LocationInfoProps {
  myLocation?: ILocation;
  yourLocation?: ILocation;
  endLocation?: ILocation;
  onGetMyLocation?: () => void;
  onGetYourLocation?: () => void;
  onCopyLocation?: () => void;
  showMyLocation?: boolean;
  showYourLocation?: boolean;
  showEndLocation?: boolean;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  yourLocation,
  onGetYourLocation,
  onCopyLocation,
  showMyLocation = false,
  showYourLocation = false,
  showEndLocation = false
}) => {
  const dispatch = useDispatch();
  const myLocation = useSelector((state: RootState) => state.map.myLocation);
  const endLocation = useSelector((state: RootState) => state.map.endLocation);
  useEffect(() => {
    // 내 위치 가져오기
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const address = await getAddressFromCoords(
                position.coords.latitude,
                position.coords.longitude
              );

              dispatch(
                setMyLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  address: address
                })
              );
            } catch (error) {
              console.error('주소 변환 중 오류 발생:', error);
              dispatch(
                setMyLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  address: '주소를 가져올 수 없습니다.'
                })
              );
            }
          },
          (error) => {
            console.error('위치 정보를 가져오지 못함:', error);
          }
        );
      }
    }, 1000);
  }, []); // 내 위치는 컴포넌트 마운트 시 한 번만 실행

  // endLocation이 변경될 때마다 주소 업데이트
  useEffect(() => {
    const updateEndLocationAddress = async () => {
      if (endLocation.lat && endLocation.lng) {
        try {
          const address = await getAddressFromCoords(endLocation.lat, endLocation.lng);
          dispatch(
            setEndLocation({
              ...endLocation,
              address: address
            })
          );
        } catch (error) {
          console.error('목적지 주소 변환 중 오류 발생:', error);
          dispatch(
            setEndLocation({
              ...endLocation,
              address: '주소를 가져올 수 없습니다.'
            })
          );
        }
      }
    };

    updateEndLocationAddress();
  }, [endLocation.lat, endLocation.lng]); // endLocation의 위도나 경도가 변경될 때마다 실행

  return (
    <div className="bg-white rounded-t-3xl shadow-lg max-h-[18rem] ">
      <Grid cols={1}>

        
        {/* 목적지 위치 */}
        {showEndLocation && (
          <GridItem className="bg-green-50 p-2.5 mt-[-15px]">
            <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
              <div className="w-8 h-8 bg-primary rounded-full grid place-items-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">목적지</p>
                <p className="font-medium text-sm truncate">
                  {endLocation?.address || '위치를 선택해주세요'}
                </p>
              </div>
            </div>
          </GridItem>
        )}
        
        {/* 내 위치 */}
        {showMyLocation && (
          <GridItem className="bg-blue-50 p-2.5 mt-[-15px]">
            <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full grid place-items-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">내 위치</p>
                <p className="font-medium text-sm truncate">
                  {myLocation?.address || '위치를 가져오는 중...'}
                </p>
              </div>
            </div>
          </GridItem>
        )}

        {/* 상대방 위치 */}
        {showYourLocation && (
          <GridItem className="bg-grat-50 p-2.5 mt-[-15px]">
            <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full grid place-items-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">상대방 위치</p>
                <p className="font-medium text-sm truncate">
                  {yourLocation?.address || '위치 정보 없음'}
                </p>
                {onGetYourLocation && (
                  <button
                    onClick={onGetYourLocation}
                    className="text-xs text-green-500 mt-1 hover:text-green-600"
                  >
                    위치 업데이트
                  </button>
                )}
              </div>
            </div>
          </GridItem>
        )}


        {/* 위치 공유 버튼 */}
        {onCopyLocation && (
          <GridItem>
            <button
              onClick={onCopyLocation}
              className="w-full bg-primary text-white mt-[-15px] rounded-none text-mb font-medium
                       hover:bg-primary-dark transition-colors duration-200"
            >
              현재 위치 공유하기
            </button>
          </GridItem>
        )}
      </Grid>
    </div>
  );
};

export default LocationInfo;
