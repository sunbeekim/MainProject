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
  setError
} from '../../store/slices/productSlice';
import { registerProduct } from '../../services/api/productAPI';

const ProductRegister = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { registerForm, isLoading } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);
  console.log(registerForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateProductForm({ [name]: value }));
  };

  const handleRadioButtonChange = (field: string, value: string) => {
    dispatch(updateProductForm({ [field]: value }));
  };

  const handleInterestSelect = (categoryId: number) => {
    dispatch(
      updateProductForm({
        categoryId,        
      })
    );
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

  const handleSubmit = async () => {
    try {
      if (!user?.email) {
        throw new Error('로그인이 필요합니다.');
      }

      // 필수 필드 검증
      if (
        !registerForm.title ||
        !registerForm.description ||
        !registerForm.price ||
        !registerForm.categoryId ||
        !registerForm.transactionType ||
        !registerForm.registrationType
      ) {
        throw new Error('필수 항목을 모두 입력해주세요.');
      }

      // 대면 거래인 경우 위치 정보 검증
      if (
        registerForm.transactionType === '대면' &&
        (!registerForm.meetingPlace ||
          !registerForm.latitude ||
          !registerForm.longitude ||
          !registerForm.address)
      ) {
        throw new Error('대면 거래의 경우 위치 정보가 필요합니다.');
      }

      const productData = {
        title: registerForm.title,
        description: registerForm.description,
        price: registerForm.price,
        email: user.email,
        hobbyId: registerForm.hobbyId,
        categoryId: registerForm.categoryId,
        transactionType: registerForm.transactionType,
        registrationType: registerForm.registrationType,
        meetingPlace: registerForm.meetingPlace,
        latitude: registerForm.latitude,
        longitude: registerForm.longitude,
        address: registerForm.address,
        maxParticipants: Number(registerForm.maxParticipants) || 1,
        selectedDays: registerForm.selectedDays || [],
        startDate: registerForm.startDate,
        endDate: registerForm.endDate
      };

      console.log('productData', productData);

      const response = await registerProduct(productData, registerForm.images || []);

      if (response.status === 'success') {
        dispatch(resetProductForm());
        navigate('/');
      } else {
        throw new Error(response.data.message || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : '상품 등록에 실패했습니다.'));
    }
  };

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
              checkedTextColor='text-white'
              checkedBackgroundColor='bg-primary-500'
              checked={registerForm.transactionType === '대면'}
              onChange={(value) => handleRadioButtonChange('transactionType', value)}
              variant="circle"
              size="sm"
              className="shadow-sm border-primary-300 border-2 rounded-lg"
            />
            <RadioButton
              label="비대면"
              value="비대면"
              checkedTextColor='text-white'
              checkedBackgroundColor='bg-primary-500'
              checked={registerForm.transactionType === '비대면'}
              onChange={(value) => handleRadioButtonChange('transactionType', value)}
              variant="circle"
              size="sm"
              className="shadow-sm border-primary-300 border-2 rounded-lg"
            />
            {registerForm.transactionType === '대면' && (
              <BaseButton variant="primary" onClick={() => navigate('/product/location')}>
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
            checkedTextColor='text-white'
            checkedBackgroundColor='bg-primary-500'
            checked={registerForm.registrationType === '판매'}
            onChange={(value) => handleRadioButtonChange('registrationType', value)}
            variant="circle"
            size="sm"
            className="shadow-sm border-primary-300 border-2 rounded-lg"
          />
          <RadioButton
            label="구매"
            value="구매"
            checked={registerForm.registrationType === '구매'}
            checkedTextColor='text-white'
            checkedBackgroundColor='bg-primary-500'
            onChange={(value) => handleRadioButtonChange('registrationType', value)}
            variant="circle"
            size="sm"
            className="shadow-sm border-primary-300 border-2 rounded-lg"
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
              selectedHobbies={
                registerForm.hobbyId
                  ? [{ hobbyId: registerForm.hobbyId, categoryId: registerForm.categoryId || 0 }]
                  : []
              }
              categoryId={registerForm.categoryId || 0}
            />
          </BaseLabelBox>
        </div>
      }
      participants={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if ((registerForm.maxParticipants ?? 1) > 1) {
                  dispatch(
                    updateProductForm({
                      maxParticipants: registerForm.maxParticipants
                        ? registerForm.maxParticipants - 1
                        : 1
                    })
                  )
                }
              }}
              className="border p-2 border-primary-500 rounded-md hover:bg-primary-light w-7 h-7 flex items-center justify-center text-black text-lg focus:text-white focus:bg-primary-500 transition-colors"
            >
              -
            </button>
            <span>{registerForm.maxParticipants}</span>
            <button
              type="button"
              onClick={() =>
                dispatch(
                  updateProductForm({
                    maxParticipants: registerForm.maxParticipants
                      ? registerForm.maxParticipants + 1
                      : 0
                  })
                )
              }
              className="border p-2 border-primary-500 rounded-md hover:bg-primary-light w-7 h-7 flex items-center justify-center text-black text-lg focus:text-white focus:bg-primary-500 transition-colors"
            >
                +
              </button>
          </div>
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
          borderStyle="border-primary-300 border-2 rounded-lg"
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
            className='border-primary-300 border-2'
            value={registerForm.description}
            onChange={handleChange}
            placeholder="상품에 대한 상세한 설명을 입력하세요"
          />
        </BaseLabelBox>
      }
      submitButton={
        <BaseButton
          variant="primary"
          className="w-full "
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
