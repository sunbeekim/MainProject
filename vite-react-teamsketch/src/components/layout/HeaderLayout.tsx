import { ReactNode } from 'react';
import Grid from '../common/Grid';
import GridItem from '../common/GridItem';
import BackButton from '../forms/button/BackButton';

interface HeaderLayoutProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  rightContent?: ReactNode;
}

const HeaderLayout = ({ title, subtitle, actions, rightContent }: HeaderLayoutProps) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F3F2FF] dark:bg-background-dark border-b border-[#E5E1FF] dark:border-[#ffffff]/70 shadow-sm">
      <Grid cols={3} gap="md" className="items-center px-4 py-3">
        {/* 왼쪽 (백버튼) */}
        <GridItem className="flex items-center">
          <BackButton className="text-[#FFFFFF] hover:bg-[#59151C] p-2 rounded" />
        </GridItem>

        {/* 중앙 (타이틀 & 서브타이틀 & 액션) */}
        <GridItem className="text-center flex flex-col">
          <h1 className="text-xl font-bold text-[#59151C] dark:text-text-dark">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#59151C]/70 dark:text-text-dark/70">{subtitle}</p>
          )}
          {actions}
        </GridItem>

        {/* 오른쪽 (추가 컨텐츠 - 필요할 경우) */}
        <GridItem className="flex justify-end">{rightContent}</GridItem>
      </Grid>
    </header>
  );
};

export default HeaderLayout;
