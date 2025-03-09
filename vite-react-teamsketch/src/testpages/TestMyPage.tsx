import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser } from '../store/slices/userSlice';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState } from '../store/store';
import TestMyPageLayout from './TestMyPageLayout';
import { getProfileImage } from '../services/api/imageAPI';
import { FileResponse } from '../types/fileResponse';
import { useEffect } from 'react';

const TestMyPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);
  const queryClient = useQueryClient();
  console.log(user);

  const {
    data: profileImage,
    isLoading,
    isError,
    error
  } = useQuery<FileResponse | null>({
    queryKey: ['profileImage'],
    queryFn: getProfileImage,
    staleTime: 0,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // 쿼리 상태 로깅
  console.log('Query Status:', { isLoading, isError, error, profileImage });

  useEffect(() => {
    if (profileImage) {
      dispatch(
        setUser({
          ...user,
          profileImagePath: profileImage.data.response
        })
      );
    }
  }, [profileImage]);

  const handleProfileUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['profileImage'] });
  };

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 flex flex-col">
      <TestMyPageLayout
        email={user.email || ''}
        name={user.name || ''}
        nickname={user.nickname || ''}
        profileImagePath={user.profileImagePath as File | null}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default TestMyPage;
