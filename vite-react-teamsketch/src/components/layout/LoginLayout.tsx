import { ReactNode } from 'react';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';

interface LoginLayoutProps {
  title?: ReactNode;
  children?: ReactNode;
  forgotPassword?: ReactNode;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Grid cols={1} gap="md" className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          {/* 로고 및 타이틀 */}
          <GridItem className="text-center mb-6">{title}</GridItem>

          {children}

          {/* 비밀번호 찾기 */}
          <GridItem className="text-right mb-4">{forgotPassword}</GridItem>

          {/* 로그인 버튼 */}
          <GridItem className="mb-6">{loginButton}</GridItem>

          {/* 구분선 */}
          <GridItem className="mb-6">{divider}</GridItem>

          {/* 소셜 로그인 버튼들 */}
          <GridItem>{socialLogins}</GridItem>

          {/* 회원가입 링크 */}
          <GridItem className="text-center">{signupLink}</GridItem>
        </Grid>
      </div>
    </div>
  );
};

export default LoginLayout;
