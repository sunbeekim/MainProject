import { useState } from 'react';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';
import DaySelect from './DaySelect';
import BaseButton from '../common/BaseButton';
import BaseLabelBox from '../common/BaseLabelBox';


interface PDLayoutProps {
  images: string[];
  mainCategory: string;
  subCategory: string;
  dopamine: number;
  number: number;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  startDate?: string;
  endDate?: string;
  location: string;
}

const PDLayout: React.FC<PDLayoutProps> = ({
  images,
  mainCategory,
  subCategory,
  dopamine,
  number,
  description,
  maxParticipants,
  currentParticipants,
  startDate,
  endDate,
  location
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('');

  return (
    <div className="container mx-auto px-4 py-8">
      <Grid cols={1} className="max-w-4xl mx-auto gap-6">
        {/* 이미지 리스트 */}
        <GridItem>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            {/* 이미지 슬라이더 구현 필요 */}
            <img src={images[0]} alt="메인 이미지" className="w-full h-full object-cover" />
          </div>
        </GridItem>

        {/* 카테고리 및 정보 */}
        <GridItem>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex gap-4">
              <span className="text-primary-light">{mainCategory}</span>
              <span className="text-gray-400">{'>'}</span>
              <span className="text-primary-light">{subCategory}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-yellow-500">도파민 {dopamine}</span>
              <span className="text-gray-600">#{number}</span>
            </div>
          </div>
        </GridItem>

        {/* 소개글 */}
        <GridItem>
          <BaseLabelBox label="소개">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 whitespace-pre-line">{description}</p>
            </div>
          </BaseLabelBox>
        </GridItem>

        {/* 모집 인원 */}
        <GridItem>
          <BaseLabelBox label="모집 인원">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span>참여 인원</span>
                <span className="text-primary-light font-bold">
                  {currentParticipants} / {maxParticipants}명
                </span>
              </div>
            </div>
          </BaseLabelBox>
        </GridItem>

        {/* 요일 선택 */}
        <GridItem>
          <BaseLabelBox label="요일 선택">
            <DaySelect selectedDay={selectedDay} onDaySelect={setSelectedDay} />
          </BaseLabelBox>
        </GridItem>

        {/* 기간 */}
        <GridItem>
          <BaseLabelBox label="기간">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span>{startDate}</span>
                <span>~</span>
                <span>{endDate}</span>
              </div>
            </div>
          </BaseLabelBox>
        </GridItem>

        {/* 위치 정보 */}
        <GridItem>
          <BaseLabelBox label="위치">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">{location}</p>
            </div>
          </BaseLabelBox>
        </GridItem>

        {/* 지도 */}
        <GridItem>
          <div className="h-64 bg-gray-100 rounded-lg">
            {/* 카카오맵 또는 네이버맵 컴포넌트 구현 필요 */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              지도가 표시될 영역
            </div>
          </div>
        </GridItem>

        {/* 신청하기 버튼 */}
        <GridItem>
          <BaseButton variant="primary" className="w-full py-4">
            신청하기
          </BaseButton>
        </GridItem>
      </Grid>
    </div>
  );
};

export default PDLayout;
