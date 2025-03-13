import { useState } from 'react';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';
import DaySelect from '../forms/radiobutton/DaySelect';
import BaseButton from '../common/BaseButton';
import BaseLabelBox from '../common/BaseLabelBox';
import { CgArrowLongRightC } from "react-icons/cg";

interface PDLayoutProps {
  images?: string[];
  category?: string;
  hobby?: string;
  dopamine?: number;
  id?: number;
  bio?: string;
  description?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  startDate?: string;
  endDate?: string;
  meetingPlace?: string;
  btName?: string;
  price?: string;
  transactionType?: string;
  email?: string;
  nickname?: string;
  map?: React.ReactNode;
}

const PDLayout: React.FC<PDLayoutProps> = ({
  images,
  category,
  hobby,
  dopamine,
  bio,
  description,
  maxParticipants,
  currentParticipants,
  startDate,
  endDate,
  meetingPlace,
  btName,
  nickname,
  map,

}) => {
  const [selectedDay, setSelectedDay] = useState<string[]>([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Grid cols={1} className="max-w-4xl mx-auto gap-6">
        {/* 이미지 리스트 */}
        <GridItem>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            {/* 이미지 슬라이더 구현 필요 */}
            <img src={images?.[0]} alt="메인 이미지" className="w-full h-full object-cover" />
          </div>
        </GridItem>

        {/* 카테고리 및 정보 */}
        <GridItem>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex gap-4">
              <span className="text-primary-light">{category}</span>
              <span className="text-gray-400">{<CgArrowLongRightC/>}</span>
              <span className="text-primary-light">{hobby}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-yellow-500">도파민 {dopamine}</span>
              <span className="text-gray-400">{nickname}</span>
              
            </div>
          </div>
        </GridItem>
        <GridItem>
          <BaseLabelBox label="유저소개">
            <p className="text-gray-600 whitespace-pre-line">{bio}</p>
          </BaseLabelBox>
        </GridItem>

        {/* 소개글 */}
        <GridItem>
          <BaseLabelBox label="상품소개">
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
          <BaseLabelBox label="요일">
            <DaySelect onDaySelect={setSelectedDay} selectedDays={selectedDay} />
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
          <BaseLabelBox label="장소">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">{meetingPlace}</p>
            </div>
          </BaseLabelBox>
        </GridItem>

        {/* 지도 */}
        <GridItem>
          <div className="h-[400px] lg:h-[800px] bg-gray-100 rounded-lg">            
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {map}
            </div>
          </div>
        </GridItem>

        {/* 신청 or 등록록하기 버튼 */}
        <GridItem>
          <BaseButton variant="primary" className="w-full py-4">
            {btName}하기
          </BaseButton>
        </GridItem>
      </Grid>
    </div>
  );
};

export default PDLayout;
