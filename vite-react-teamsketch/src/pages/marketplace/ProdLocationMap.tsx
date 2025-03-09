import OpenMap from '../../components/features/location/OpenMap';
import SearchLocation from '../../components/features/location/SearchLocation';
import LocationInfo from '../../components/features/location/LocationInfo';
import LocationLayout from '../../components/layout/LocationLayout';
import { useNavigate } from 'react-router-dom';
import BaseButton from '../../components/common/BaseButton';

const ProdLocationMap = () => {
    const navigate = useNavigate();
    

    return (
        <div className="h-full w-full">
            <LocationLayout
                childrenTop={<SearchLocation />}
                childrenCenter={<OpenMap />}
                childrenBottom={
                    <LocationInfo 
                        showEndLocation={true} 
                        showMyLocation={true}                  
                    />}
                childrenButton={
                    
                        <BaseButton
                            variant="primary"
                            className="w-full rounded-none"
                            onClick={() => navigate(-1)}
                        >
                            위치 선택 완료
                        </BaseButton>
                    
                }
            ></LocationLayout>      
        </div>
    );
};

export default ProdLocationMap;
