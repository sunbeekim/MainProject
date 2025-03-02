import { ReactNode } from 'react';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';

interface LoginLayoutProps {
  title?: ReactNode;
  children?: ReactNode;
  forgotPassword?: ReactNode
  loginButton?: ReactNode;
  divider?: ReactNode;
  socialLogins?: ReactNode;
  signupLink?: ReactNode;
}

const LoginLayout = ({
  title,
  children,
  forgotPassword,
  loginButton,
  divider,
  socialLogins,
  signupLink
}: LoginLayoutProps) => {
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800">
      <Grid cols={1} gap="sm" className="h-full p-3 sm:p-4 lg:p-8 grid grid-rows-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center">
        {/* 로고 및 타이틀 */}
        <GridItem className="flex items-center justify-center">
          <div className="text-sm sm:text-base lg:text-lg">{title}</div>
        </GridItem>

        {/* 메인 폼 */}
        <GridItem className="flex items-center justify-center">
          <div className="w-[70%] flex flex-col gap-2">
            {children}
          </div>
        </GridItem>

        {/* 비밀번호 찾기 */}
        <GridItem className="flex items-center justify-end w-[70%] mx-auto">
          <div className="text-xs sm:text-sm">{forgotPassword}</div>
        </GridItem>

        {/* 로그인 버튼 */}
        <GridItem className="flex items-center justify-center">
          <div className="w-[70%] text-sm sm:text-base">
            {loginButton}
          </div>
        </GridItem>

        {/* 구분선 */}
        <GridItem className="flex items-center justify-center">
          {divider}
        </GridItem>

        {/* 소셜 로그인 버튼들 */}
        <GridItem className="flex items-center justify-center">
          {socialLogins}
        </GridItem>

        {/* 회원가입 링크 */}
        <GridItem className="flex items-center justify-center">
          <div className="text-xs sm:text-sm">{signupLink}</div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default LoginLayout;
