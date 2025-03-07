import Grid from '../common/Grid';
import GridItem from '../common/GridItem';

interface PRLayoutProps {
  title?: React.ReactNode;
  productTitle?: React.ReactNode;
  price?: React.ReactNode;
  transactionType?: React.ReactNode;
  registrationType?: React.ReactNode;
  category?: React.ReactNode;
  participants?: React.ReactNode;
  schedule?: React.ReactNode;
  images?: React.ReactNode;
  description?: React.ReactNode;
  submitButton?: React.ReactNode;
}

const PRLayout = ({
  title,
  productTitle,
  price,
  transactionType,
  registrationType,
  category,
  participants,
  schedule,
  images,
  description,
  submitButton
}: PRLayoutProps) => {
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800">
      <Grid cols={1} gap="sm" className="h-full p-4 sm:p-6">
        {/* 타이틀 */}
        <GridItem className="flex items-center justify-center mb-4">
          <div className="text-xl font-semibold">{title}</div>
        </GridItem>

        {/* 메인 폼 영역 */}
        <GridItem className="space-y-6">
          {/* 제목 입력 */}
          <div className="space-y-2">
            <h2 className="font-bold">제목</h2>
            {productTitle}
          </div>

          {/* 가격 입력 */}
          <div className="space-y-2">
            <h2 className="font-bold">가격</h2>
            {price}
          </div>

          {/* 거래 방식 & 등록 유형 */}
          <Grid cols={2} gap="sm">
            <GridItem className="space-y-2">
              <h2 className="font-bold text-sm text-gray-700">거래 방식</h2>
              {transactionType}
            </GridItem>
            <GridItem className="space-y-2">
              <h2 className="font-bold text-sm text-gray-700">등록 유형</h2>
              {registrationType}
            </GridItem>
          </Grid>

          {/* 카테고리 */}
          <div className="space-y-2">
            <h2 className="font-bold">카테고리</h2>
            {category}
          </div>

          {/* 모집 인원 */}
          <div className="space-y-2">
            <h2 className="font-bold">모집 인원</h2>
            {participants}
          </div>

          {/* 일정 기간 */}
          <div className="space-y-2">
            <h2 className="font-bold">일정 기간</h2>
            {schedule}
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <h2 className="font-bold">상품 이미지 업로드</h2>
            {images}
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <h2 className="font-bold">설명</h2>
            {description}
          </div>
        </GridItem>

        {/* 등록 버튼 - 하단 고정 */}
        <GridItem className="sticky bottom-0 bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <div className="max-w-2xl mx-auto">
            {submitButton}
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default PRLayout;
