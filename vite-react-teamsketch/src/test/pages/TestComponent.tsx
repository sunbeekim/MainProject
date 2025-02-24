import Button from '../components/common/button/Button';
import Container from '../components/layout/Container';
import Card from '../components/features/card/Card';
import BackButton from '../components/common/button/BackButton';
import Select from '../components/common/select/Select';
import Grid from '../../components/common/Grid';
import GridItem from '../../components/common/GridItem';
import ImageUpload from '../components/common/upload/ImageUpload';
import { CloudOCR } from '../services/api/testAPI';
import { increment, decrement } from '../../store/slices/testSlice';
import { useAppSelector, useAppDispatch } from '../../store/hooks';

const TestComponent = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.test.value);
  const options = [
    { value: '1', label: '오름차순' },
    { value: '2', label: '내림차순' },
  ];

  return (
    <Container className="py-8">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">컴포넌트 테스트 페이지</h1>
      
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">버튼 테스트</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary">Primary 버튼</Button>
            <Button variant="secondary">Secondary 버튼</Button>
            <Button variant="outline">Outline 버튼</Button>
            <Button variant="primary" disabled>비활성화 버튼</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">카드 테스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="테스트 카드 1"
              description="카드 컴포넌트 테스트입니다."
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
          <h2 className="text-xl font-semibold mb-4">이미지 업로드 테스트</h2>
          <ImageUpload 
            onUpload={CloudOCR}
            className="max-w-md mx-auto"
          />
        </div>
      </section>
      <div>
        <h2 className="text-xl font-semibold mb-4">카운터 테스트</h2>
        <p>현재 카운터 값: {count}</p>
        <Button onClick={() => dispatch(increment(2))}>증가</Button>
        <Button onClick={() => dispatch(decrement(2))}>감소</Button>
      </div>
    </Container>
  );
};

export default TestComponent;
