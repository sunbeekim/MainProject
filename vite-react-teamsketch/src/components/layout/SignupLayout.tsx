import { ReactNode } from 'react';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';

interface SignupLayoutProps {
  title?: ReactNode;
  children?: ReactNode;
  signupButton?: ReactNode;
  divider?: ReactNode;
  loginSection?: ReactNode;
}

const SignupLayout = ({
  title,
  children,
  signupButton,
  divider,
  loginSection
}: SignupLayoutProps) => {
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 ">
      <Grid cols={1} gap="sm" className="h-full p-3 sm:p-4 lg:p-8 grid grid-rows-[0.4fr_3fr_0.5fr] items-center ">
        {/* 로고 및 타이틀 */}
        <GridItem className="flex  items-center justify-center">
          <div className="text-sm sm:text-base lg:text-lg">{title}</div>
        </GridItem>

        {/* 메인 폼 */}
        <GridItem className="flex items-center justify-center">
          <div className="w-[70%] flex flex-col gap-2">
            {children}
          </div>
        </GridItem>

        {/* 회원가입 버튼 */}
        <GridItem className="flex items-center justify-center">
          <div className="w-[70%] text-sm sm:text-base">
            {signupButton}
          </div>
        </GridItem>

        {/* 구분선 */}
        <GridItem className="flex items-center justify-center">
          <div className="w-[70%]">
            {divider}
          </div>
        </GridItem>

        {/* 로그인 섹션 */}
        <GridItem className="flex items-center justify-center">
          <div className="text-xs sm:text-sm">
            {loginSection}
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default SignupLayout;
