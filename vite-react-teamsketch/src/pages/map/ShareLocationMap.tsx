import OpenMap from '../../components/features/location/OpenMap';
import SearchLocation from '../../components/features/location/SearchLocation';
import LocationInfo from '../../components/features/location/LocationInfo';
import LocationLayout from '../../components/layout/LocationLayout';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getProductByProductId } from '../../services/api/productAPI';
import { ILocation } from '../../types/map';
import { setEndLocation } from '../../store/slices/mapSlice';
import { useAppDispatch } from '../../store/hooks';
interface LocationState {
  productId: number;
  endLocation?: ILocation;
}

const ShareLocationMap = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProductLocation = async () => {
      try {
        if (!state?.productId) return;

        const response = await getProductByProductId(state.productId);
        if (response && response.latitude && response.longitude) {
          const location: ILocation = {
            lat: response.latitude,
            lng: response.longitude,
            address: response.address || '',
            meetingPlace: response.meetingPlace || ''
          };
          dispatch(setEndLocation(location));
        }
      } catch (error) {
        console.error('상품 위치 정보 조회 실패:', error);
      }
    };

    fetchProductLocation();
  }, [state?.productId]);

  return (
    <div className="h-full w-full">
      <LocationLayout
        childrenTop={<SearchLocation onLocationSelect={() => {}} />}
        childrenCenter={<OpenMap nonClickable={true} mode="all" />}
        childrenBottom={
          <LocationInfo            
            showEndLocation={true}
            showMyLocation={true}
            showYourLocation={true}
          />
        }
      ></LocationLayout>
    </div>
  );
};

export default ShareLocationMap;
