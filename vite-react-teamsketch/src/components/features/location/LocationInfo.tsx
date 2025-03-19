import Grid from '../../common/Grid';
import GridItem from '../../common/GridItem';
import { ILocation } from '../../../types/map';
import { useDispatch, useSelector } from 'react-redux';
import { setMyLocation, setYourLocation, setEndLocation } from '../../../store/slices/mapSlice';
import { useEffect, useState, useRef } from 'react';
import { RootState } from '../../../store/store';
import { getAddressFromCoords } from '../../../services/third-party/myLocation';
import { LuArrowDownToLine, LuArrowUpToLine } from 'react-icons/lu';

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
  mode?: 'myLocation' | 'yourLocation' | 'endLocation';
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  onGetYourLocation,
  onCopyLocation,
  showMyLocation = false,
  showYourLocation = false,
  showEndLocation = false,
  mode = 'endLocation'
}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const myLocation = useSelector((state: RootState) => state.map.myLocation);
  const yourLocation = useSelector((state: RootState) => state.map.yourLocation);
  const endLocation = useSelector((state: RootState) => state.map.endLocation);
  
  // 각 위치 타입별 처리 상태를 추적
  const locationProcessed = useRef({
    myLocation: false,
    yourLocation: false,
    endLocation: false
  });

  // 선택된 위치의 주소 업데이트 함수
  const updateLocationAddress = async (location: ILocation) => {
    if (!location?.lat || !location?.lng) {
      console.log('위치 정보가 없습니다.');
      return;
    }
    
    try {
      const address = await getAddressFromCoords(location.lat, location.lng);
      if (!address) {
        throw new Error('주소를 가져올 수 없습니다.');
      }
      console.log('address', address);
      const meetingPlace = address.split(' ')[0];
      
      switch (mode) {
        case 'myLocation':
          dispatch(setMyLocation({ ...location, address, meetingPlace }));
          break;
        case 'yourLocation':
          dispatch(setYourLocation({ ...location, address, meetingPlace }));
          break;
        case 'endLocation':
          dispatch(setEndLocation({ ...location, address, meetingPlace }));
          break;
      }
      
      locationProcessed.current[mode] = true;
    } catch (error) {
      console.error(`${mode} 주소 변환 중 오류 발생:`, error);
      const errorAction = {
        myLocation: setMyLocation,
        yourLocation: setYourLocation,
        endLocation: setEndLocation
      }[mode];
      
      dispatch(errorAction({ ...location, address: '주소를 가져올 수 없습니다.' }));
      locationProcessed.current[mode] = true;
    }
  };

  // 모드가 변경될 때마다 해당 위치의 주소를 업데이트
  useEffect(() => {
    const locationMap = {
      myLocation,
      yourLocation,
      endLocation
    };

    const currentLocation = locationMap[mode];
    
    // 위치가 있고 아직 처리되지 않은 경우에만 업데이트
    if (currentLocation?.lat && currentLocation?.lng && !locationProcessed.current[mode]) {
      updateLocationAddress(currentLocation);
    }
  }, [mode, myLocation.lat, myLocation.lng, yourLocation?.lat, yourLocation?.lng, endLocation.lat, endLocation.lng]);

  // 내 위치 자동 가져오기 (최초 1회)
  useEffect(() => {
    if (mode === 'myLocation' && !locationProcessed.current.myLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: '위치를 가져오는 중...',
              meetingPlace: '위치를 가져오는 중...'
            };
            dispatch(setMyLocation(newLocation));
            await updateLocationAddress(newLocation);
          },
          (error) => {
            console.error('위치 정보를 가져오지 못함:', error);
          }
        );
      }
    }
  }, [mode]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg max-h-[18rem]">
      <Grid cols={1} gap="none">
        <GridItem className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-t-3xl -mt-8 relative z-10">
          <div className="flex items-center justify-center">
            {isExpanded ? (
              <LuArrowDownToLine
                className="w-5 h-5 text-white/90 hover:text-white cursor-pointer transform hover:scale-110 transition-all duration-300"
                onClick={() => setIsExpanded(!isExpanded)}
              />
            ) : (
              <LuArrowUpToLine
                className="w-5 h-5 text-white/90 hover:text-white cursor-pointer transform hover:scale-110 transition-all duration-300"
                onClick={() => setIsExpanded(!isExpanded)}
              />
            )}
          </div>
        </GridItem>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-[500px]' : 'max-h-0'
          }`}
        >
          {/* 목적지 위치 */}
          {showEndLocation && (
            <GridItem className="bg-primary-500 p-2 border-b border-white dark:border-primary-500">
              <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
                <div className="w-4 h-8 bg-green-500 rounded-full grid place-items-center relative">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-2 animate-pulse" />
                </div>
                <div>
                  <p className="text-white/80 dark:text-gray-300 text-sm">장소</p>
                  <p className="font-medium text-sm text-white dark:text-gray-100 truncate">
                    {endLocation?.address || '위치를 선택해주세요'}
                  </p>
                </div>
              </div>
            </GridItem>
          )}

          {/* 내 위치 */}
          {showMyLocation && (
            <GridItem className="bg-primary-500 p-2 border-b border-white dark:border-primary-500">
              <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
                <div className="w-4 h-8 bg-blue-500 rounded-full grid place-items-center relative">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-2 animate-pulse" />
                </div>
                <div>
                  <p className="text-white/80 dark:text-gray-300 text-sm">내 위치</p>
                  <p className="font-medium text-sm text-white dark:text-gray-100 truncate">
                    {myLocation?.address || '위치를 가져오는 중...'}
                  </p>
                </div>
              </div>
            </GridItem>
          )}

          {/* 상대방 위치 */}
          {showYourLocation && (
            <GridItem className="bg-primary-500 p-2 border-b border-white dark:border-primary-500">
              <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
                <div className="w-4 h-8 bg-pink-500 rounded-full grid place-items-center relative">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-2 animate-pulse" />
                </div>
                <div>
                  <p className="text-white/80 dark:text-gray-300 text-sm">상대방 위치</p>
                  <p className="font-medium text-sm text-white dark:text-gray-100 truncate">
                    {yourLocation?.address || '위치 정보 없음'}
                  </p>
                  {onGetYourLocation && (
                    <button
                      onClick={onGetYourLocation}
                      className="mt-2 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-full transition-colors shadow-sm hover:shadow-md"
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
            <GridItem className="bg-primary-500 p-2 border-b border-white dark:border-primary-500">
              <button
                onClick={onCopyLocation}
                className="w-full bg-primary-500 rounded-none text-sm font-medium py-2.5 hover:bg-primary-600 transition-all duration-300"
              >
                현재 위치 공유하기
              </button>
            </GridItem>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default LocationInfo;
