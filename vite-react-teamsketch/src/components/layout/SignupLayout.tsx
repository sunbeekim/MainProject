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
  loginSection,
}: SignupLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-lg">
        <Grid cols={1} gap="md" className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <GridItem className="text-center mb-8">
            {title}
          </GridItem>

          {children}

          <GridItem className="mt-6">
            {signupButton}
          </GridItem>

          <GridItem>
            {divider}
          </GridItem>

          <GridItem className="text-center">
            {loginSection}
          </GridItem>
        </Grid>
      </div>
    </div>
  );
};

export default SignupLayout;
