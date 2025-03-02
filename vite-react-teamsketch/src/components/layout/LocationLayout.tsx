import BaseButton from '../common/BaseButton';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';

interface ILocation {
  id: string;
  name: string;
  address: string;
}

interface LocationLayoutProps {
  children: React.ReactNode;
  startLocation?: ILocation;
  endLocation?: ILocation;
  onCopyLocation?: () => void;
  onGetCurrentLocation: () => void;
}

const LocationLayout: React.FC<LocationLayoutProps> = ({
  children,
  startLocation,
  endLocation,
  onCopyLocation
}) => {
  return (
    <div className="h-screen grid grid-rows-[1fr,auto]">
      {/* 지도 영역 */}
      <div className="relative bg-gray-200">
        {children}
        <div className="absolute top-4 left-4 z-10">
          <button 
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
            onClick={() => window.history.back()}
          >
            <span className="text-xl">←</span>
          </button>
        </div>
      </div>

      {/* 위치 정보 영역 */}
      <div className="bg-white rounded-t-3xl -mt-6 shadow-lg">
        <Grid cols={1} className="p-6 gap-6">
          {/* 출발 위치 */}
          <GridItem>
            <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
              <div className="w-8 h-8 bg-primary rounded-full grid place-items-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">출발 위치</p>
                <p className="font-medium">{startLocation?.address || "위치를 선택해주세요"}</p>
              </div>
            </div>
          </GridItem>

          {/* 도착 위치 */}
          <GridItem>
            <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
              <div className="w-8 h-8 bg-primary rounded-full grid place-items-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">목적지</p>
                <p className="font-medium">{endLocation?.address || "위치를 선택해주세요"}</p>
              </div>
            </div>
          </GridItem>

          {/* 복사 버튼 */}
          <GridItem>
            <BaseButton
              variant="primary"
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold"
              onClick={onCopyLocation}
            >
              현재 위치 공유하기
            </BaseButton>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
};

export default LocationLayout;
