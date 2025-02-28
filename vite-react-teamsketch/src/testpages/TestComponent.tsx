import Button from '../components/common/Button';
import Card from '../components/features/card/Card';
import Select from '../components/common/Select';
import Grid from '../components/common/Grid';
import GridItem from '../components/common/GridItem';
import ImageUpload from '../components/features/upload/ImageUpload';
import { fileUpload } from '../services/api/testAPI';
import { increment, decrement } from '../store/slices/testSlice';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import SearchInput from '../components/forms/input/SearchInput';
import { useState } from 'react';
import InfoBox from '../components/forms/box/InfoBox';
import CustomInput from '../components/forms/input/CustomInput';
import DaySection from '../components/layout/DaySelect';
const TestComponent = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.test.value);
  const count = useAppSelector((state) => state.test.count);

  const [selectedDay, setSelectedDay] = useState('');
  const options = [
    { value: '1', label: '오름차순' },
    { value: '2', label: '내림차순' }
  ];

  const [search, setSearch] = useState('');

  return (
    <div className="p-8 space-y-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">컴포넌트 테스트 페이지</h1>

      <section className="space-y-6 w-full max-w-3xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-semibold mb-4">버튼 테스트</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary">Primary 버튼</Button>
            <Button variant="secondary">Secondary 버튼</Button>
            <Button variant="outline">Outline 버튼</Button>
            <Button variant="primary" disabled>
              비활성화 버튼
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">카드 테스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="테스트 카드 1"
              description="카드 컴포넌트 테스트입니다."
              image="https://picsum.photos/200/300"
            />
            <Card
              title="테스트 카드 2"
              description="이미지가 있는 카드입니다."
              image="https://picsum.photos/200/300"
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">선택 테스트</h2>
          <Select options={options} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">그리드 테스트</h2>
          <Grid>
            <GridItem>
              <h3>그리드 아이템 1</h3>
            </GridItem>
          </Grid>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">OCR 이미지 업로드 테스트</h2>
          <ImageUpload onUpload={fileUpload.CloudOCR} className="max-w-md mx-auto" type="ocr" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">프로필 이미지 업로드 테스트</h2>
          <ImageUpload onUpload={fileUpload.Profile} className="max-w-md mx-auto" type="profile" />
        </div>
      </section>
      <div>
        <h2 className="text-xl font-semibold mb-4">카운터 테스트</h2>
        <p>현재 Value 값: {value}</p>
        <p>현재 Count 값: {count}</p>
        <Button onClick={() => dispatch(increment(2))}>증가</Button>
        <Button onClick={() => dispatch(decrement(2))}>감소</Button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4"></h2>
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} name="search" />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">InfoBox 테스트</h2>
        <InfoBox label="테스트 라벨" content="테스트 컨텐츠" description="테스트 설명" />
      </div>
      <div>
        <CustomInput label="금액" prefix="₩" suffix="원" helperText="1,000원 단위로 입력해주세요" />
      </div>
      <div>
        <CustomInput
          label="웹사이트"
          prefix="https://"
          suffix=".com"
          helperText="도메인 이름만 입력해주세요"
        />
      </div>
      <div>
        <CustomInput
          label="사용자 이름"
          prefix="이름->"
          suffix="입니다."
          helperText="영문, 숫자, 밑줄(_)만 사용 가능합니다"
        />
      </div>
      <div>
        <button className="bg-border-light">스타일 테스트</button>
      </div>
      <div className="bg-purple-level_1">
        <label className="text-purple_color-level_10">ddddd</label>
      </div>
      <div className="w-full max-w-3xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <DaySection onDaySelect={setSelectedDay} selectedDay={selectedDay} />
      </div>
    </div>
  );
};

export default TestComponent;
