import OpenMap from '../../components/features/location/OpenMap';
import SearchLocation from '../../components/features/location/SearchLocation';
import LocationInfo from '../../components/features/location/LocationInfo';
import LocationLayout from '../../components/layout/LocationLayout';



const ShareLocationMap = () => {   
    return (
        <div className="h-full w-full">
            <LocationLayout
                childrenTop={<SearchLocation onLocationSelect={() => {}} />}
                childrenCenter={<OpenMap />}
                childrenBottom={
                    <LocationInfo 
                        showEndLocation={true} 
                        showMyLocation={true}
                        showYourLocation={true}
                        onCopyLocation={() => {                           
                        }}                      
                    />}                
            ></LocationLayout>      
        </div>
    );
};

export default ShareLocationMap;
