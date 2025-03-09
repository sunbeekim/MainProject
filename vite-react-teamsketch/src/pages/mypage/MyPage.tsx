import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser } from '../../store/slices/userSlice';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState } from '../../store/store';
import MyPageLayout from '../../components/layout/MyPageLayout';
import { getProfileImage } from '../../services/api/imageAPI';
import { FileResponse } from '../../types/fileResponse';
import { useEffect } from 'react';
import { FaUserCog, FaBoxOpen, FaCreditCard, FaHistory, FaHeadset } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);
  const queryClient = useQueryClient();
  console.log(user);
  const navigate = useNavigate();

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

  const menuItems = [
    {
      icon: <FaUserCog size={20} />,
      label: '프로필 관리',
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/30',
      onClick: () => navigate('/profile-manage')
    },
    {
      icon: <FaBoxOpen size={20} />,
      label: '상품 관리',
      color: 'hover:bg-purple-50 dark:hover:bg-purple-900/30'
    },
    {
      icon: <FaCreditCard size={20} />,
      label: '결제 수단',
      color: 'hover:bg-green-50 dark:hover:bg-green-900/30'
    },
    {
      icon: <FaHistory size={20} />,
      label: '거래 내역',
      color: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
    },
    {
      icon: <FaHeadset size={20} />,
      label: '고객 센터',
      color: 'hover:bg-pink-50 dark:hover:bg-pink-900/30'
    }
  ];

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 flex flex-col">
      <MyPageLayout        
        email={user.email || ''}
        name={user.name || ''}
        nickname={user.nickname || ''}
        profileImagePath={user.profileImagePath as File | null}
        onProfileUpdate={handleProfileUpdate}
        menuItems={menuItems}
      />
    </div>
  );
};

export default MyPage;
