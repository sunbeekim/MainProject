import OpenMap from '../../components/features/location/OpenMap';
import SearchLocation from '../../components/features/location/SearchLocation';
import LocationInfo from '../../components/features/location/LocationInfo';
import LocationLayout from '../../components/layout/LocationLayout';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getProductByProductId } from '../../services/api/productAPI';

const ShareLocationMap = () => {

  const location = useLocation().state;
  console.log("location", location);
  
  useEffect(() => {
     const response = getProductByProductId(location.productId);
     console.log("response", response);
  }, []);

  return (
    <div className="h-full w-full">
      <LocationLayout
        childrenTop={<SearchLocation onLocationSelect={() => {}} />}
        childrenCenter={<OpenMap nonClickable={true}/>}
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
