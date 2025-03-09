import TextInput from '../../components/forms/input/TextInput';

import RadioButton from '../../components/common/RadioButton';
import InterestSelect from '../../components/forms/select/InterestSelect';
import ImageUpload from '../../components/features/upload/ImageUpload';
import TextAreaInput from '../../components/forms/textarea/TextAreaInput';
import PRLayout from '../../components/layout/PRLayout';
import { useNavigate } from 'react-router-dom'; 
import BaseLabelBox from '../../components/common/BaseLabelBox';
import HobbySelect from '../../components/forms/select/HobbySelect';
import BaseButton from '../../components/common/BaseButton';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import DaySelect from '../../components/forms/radiobutton/DaySelect';
import { 
  updateProductForm, 
  addProductImage, 
  removeProductImage,
  resetProductForm,
  setLoading,
  setError 
} from '../../store/slices/productSlice';
import { registerProduct} from '../../services/api/productAPI';
import { useEffect } from 'react';

const ProductRegister = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { registerForm, isLoading } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateProductForm({ [name]: value }));
  };

  const handleRadioButtonChange = (field: string, value: string) => {
    dispatch(updateProductForm({ [field]: value }));
  };

  const handleInterestSelect = (categoryId: number) => {
    dispatch(updateProductForm({ 
      categoryId,
      hobbyId: null 
    }));
  };

  const handleHobbySelect = (categoryId: number, hobbyId: number) => {
    dispatch(updateProductForm({ hobbyId: hobbyId, categoryId: categoryId }));
  };

  const handleFileUpload = async (formData: FormData): Promise<void> => {
    const file = formData.get('file') as File;
    if (file) {
      dispatch(addProductImage(file));
    }
  };

  const handleRemoveImage = (index: number) => {
    dispatch(removeProductImage(index));
  };
  console.log('meetingPlace', registerForm.meetingPlace);
  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // 폼 데이터 검증
      if (!registerForm.title || !registerForm.description || !registerForm.price) {
        throw new Error('필수 필드를 모두 입력해주세요.');
      }

      const productData = {
        ...registerForm,
        email: user.email,
        categoryId: Number(registerForm.categoryId),
        transactionType: registerForm.transactionType,
        registrationType: registerForm.registrationType,
        latitude: registerForm.latitude || undefined,
        longitude: registerForm.longitude || undefined,
        meetingPlace: registerForm.meetingPlace || undefined,
        address: registerForm.address || undefined,
        title: registerForm.title,
        description: registerForm.description,
        price: Number(registerForm.price),
        maxParticipants: Number(registerForm.maxParticipants) || 1,
        selectedDays: registerForm.selectedDays || [],
        imagePaths: []
      };
      console.log('productData', productData);

      const response = await registerProduct(productData, registerForm.images);
      
      if (response.status === 200) {
        dispatch(resetProductForm());
        navigate('/marketplace');
      } else {
        throw new Error(response.message || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : '상품 등록에 실패했습니다.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 위치 정보 표시 여부 확인을 위한 로깅
  useEffect(() => {
    console.log('상품 등록 폼의 위치 정보:', {
      위도: registerForm.latitude,
      경도: registerForm.longitude,
      주소: registerForm.address,
      장소명: registerForm.meetingPlace
    });
  }, [registerForm.latitude, registerForm.longitude, registerForm.address, registerForm.meetingPlace]);

  return (
    <PRLayout
      title={<h1>상품 등록</h1>}
      productTitle={
        <BaseLabelBox label="제목">
          <TextInput 
            name="title" 
            value={registerForm.title} 
            onChange={handleChange} 
            placeholder="상품 제목을 입력하세요"
            error={''} 
          />
        </BaseLabelBox>
      }
      price={
        <BaseLabelBox label="가격">
          <TextInput 
            name="price" 
            value={registerForm.price} 
            onChange={handleChange} 
            type="number"
            placeholder="가격을 입력하세요"
            error={''} 
          />
        </BaseLabelBox>
      }
      transactionType={        
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <RadioButton
              label="대면"
              value="대면"
              checked={registerForm.transactionType === '대면'}
              onChange={(value) => handleRadioButtonChange('transactionType', value)}
              variant="circle"
              size="sm"
              className="shadow-sm"
            />
            <RadioButton
              label="비대면"
              value="비대면"
              checked={registerForm.transactionType === '비대면'}
              onChange={(value) => handleRadioButtonChange('transactionType', value)}
              variant="circle"
              size="sm"
              className="shadow-sm"
            />
            {registerForm.transactionType === '대면' && (
              <BaseButton 
                variant="primary" 
                onClick={() => navigate('/product/location')}                  
              >
                {registerForm.address ? '위치 변경' : '위치 선택'}
              </BaseButton>                
            )}
          </div>            
        </div>     
      }
      registrationType={
        <div className="flex gap-3 justify-end">
          <RadioButton
            label="판매"
            value="판매"
            checked={registerForm.registrationType === '판매'}
            onChange={(value) => handleRadioButtonChange('registrationType', value)}
            variant="circle"
            size="sm"
            className="shadow-sm"
          />
          <RadioButton
            label="구매"
            value="구매"
            checked={registerForm.registrationType === '구매'}
            onChange={(value) => handleRadioButtonChange('registrationType', value)}
            variant="circle"
            size="sm"
            className="shadow-sm"
          />
        </div>
      }
      
      category={
        <div className="flex flex-col gap-2">
          <BaseLabelBox label="카테고리">
            <InterestSelect
              onInterestSelect={handleInterestSelect}
              selectedCategory={registerForm.categoryId || undefined}
            />
          </BaseLabelBox>
          <BaseLabelBox label="취미">
            <HobbySelect
              onHobbySelect={handleHobbySelect}
              selectedHobbies={registerForm.hobbyId ? [{ hobbyId: registerForm.hobbyId, categoryId: registerForm.categoryId || 0 }] : []}
              categoryId={registerForm.categoryId || 0}
            />
          </BaseLabelBox>
        </div>
      }
      participants={
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => dispatch(updateProductForm({ maxParticipants: registerForm.maxParticipants > 0 ? registerForm.maxParticipants - 1 : 0 }))}
            className="border p-2 rounded-md hover:bg-primary-light w-7 h-7 flex items-center justify-center "
          >
            -
          </button>
          <span>{registerForm.maxParticipants}</span>
          <button
            type="button"
            onClick={() => dispatch(updateProductForm({ maxParticipants: registerForm.maxParticipants + 1 }))}
            className="border p-2 rounded-md hover:bg-primary-light w-7 h-7 flex items-center justify-center"
          >
            +
          </button>
        </div>
      }
      schedule={
        <BaseLabelBox label="일정">
          <div className="flex flex-col gap-4">
            {/* 날짜 선택 */}
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-sm text-gray-600">시작 일시</label>
                <TextInput
                  type="datetime-local"
                  name="startDate"
                  value={registerForm.startDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">종료 일시</label>
                <TextInput
                  type="datetime-local"
                  name="endDate"
                  value={registerForm.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* 요일 선택 */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">진행 요일</label>
              <DaySelect 
              onDaySelect={(days: string[]) => {
                dispatch(updateProductForm({ selectedDays: days }));
              }}
              selectedDays={registerForm.selectedDays || []}
            />
            </div>
          </div>
        </BaseLabelBox>
      }
      images={
        <ImageUpload
          
          type="prod"
          multiple={true}
          images={registerForm.images}
          onFileSelect={(file) => {
            const formData = new FormData();
            formData.append('file', file);
            handleFileUpload(formData);
          }}
          onRemove={handleRemoveImage}
          maxImages={10}
          className="w-full"
        />
      }
      description={
        <BaseLabelBox label="상품 설명">
          <TextAreaInput
            name="description"
            value={registerForm.description}
            onChange={handleChange}
            placeholder="상품에 대한 상세한 설명을 입력하세요"
          />
        </BaseLabelBox>
      }
      submitButton={
        <BaseButton
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? '등록 중...' : '상품 등록'}
        </BaseButton>
      }
    />
  );
};

export default ProductRegister;
