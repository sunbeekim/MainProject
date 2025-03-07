import React, { useState } from 'react';
import TextInput from '../../components/forms/input/TextInput';
import RadioButton from '../../components/common/RadioButton';
import InterestSelect from '../../components/forms/select/InterestSelect';
import Button from '../../components/common/Button';
import SignupLayout from '../../components/layout/SignupLayout';
import ImageUpload from '../../components/features/upload/ImageUpload';

const ProductRegister = () => {
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    category: '',
    transactionType: '',
    registrationType: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    images: [] as File[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRadioButtonChange = (field: string, value: string) => {
    setProductData((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleInterestSelect = (value: string) => {
    setProductData((prevState) => ({
      ...prevState,
      category: value
    }));
  };

  const handleFileUpload = async (formData: FormData): Promise<void> => {
    const file = formData.get('file') as File;

    if (file) {
      setProductData((prevState) => ({
        ...prevState,
        images: [...prevState.images, file]
      }));
    }
  };

  const handleLocationClick = () => {
    alert('장소 지정하는 기능 구현');
  };
  const handleSubmit = () => {
    console.log('등록하기 버튼 클릭됨', productData);
  };

  return (
    <SignupLayout>
      <div className="p-4">
        <h1 className="text-xl font-semibold text-center ">상품 등록</h1>

        <div className="flex flex-col  gap-4">
          {/* 제목 */}
          <div className=" font-bold mt-4 ">제목</div>
          <TextInput name="title" value={productData.title} onChange={handleChange} error={''} />

          {/* 가격 */}
          <div className=" font-bold mt-3">가격</div>
          <TextInput name="price" value={productData.price} onChange={handleChange} error={''} />

          {/* 대면/비대면 라디오 버튼 */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-bold text-gray-700">거래 방식</span>
            <div className="flex gap-3">
              <RadioButton
                label="대면"
                value="faceToFace"
                checked={productData.transactionType === 'faceToFace'}
                onChange={(value) => handleRadioButtonChange('transactionType', value)}
                variant="circle"
                size="sm"
                className="shadow-sm"
              />
              <RadioButton
                label="비대면"
                value="nonFaceToFace"
                checked={productData.transactionType === 'nonFaceToFace'}
                onChange={(value) => handleRadioButtonChange('transactionType', value)}
                variant="circle"
                size="sm"
                className="shadow-sm"
              />
            </div>

            {/* 대면 선택 시 장소 지정하기 버튼 */}
            {productData.transactionType === 'faceToFace' && (
              <button
                onClick={handleLocationClick}
                className="ml-4 px-2 py-1 bg-primary-light hover:bg-primary text-white text-xs font-bold rounded-lg shadow-sm transition-colors duration-200"
              >
                장소 지정
              </button>
            )}
          </div>

          {/* 등록 유형 (구매/판매) 라디오 버튼 */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-bold text-gray-700">등록 유형</span>
            <div className="flex gap-3">
              <RadioButton
                label="판매"
                value="sale"
                checked={productData.registrationType === 'sale'}
                onChange={(value) => handleRadioButtonChange('registrationType', value)}
                variant="circle"
                size="sm"
                className="shadow-sm"
              />
              <RadioButton
                label="구매"
                value="buy"
                checked={productData.registrationType === 'buy'}
                onChange={(value) => handleRadioButtonChange('registrationType', value)}
                variant="circle"
                size="sm"
                className="shadow-sm"
              />
            </div>
          </div>

          {/* 카테고리 */}
          <div className=" font-bold mt-4">카테고리</div>
          <div>
            <InterestSelect
              onInterestSelect={handleInterestSelect}
              selectedInterest={productData.category}
            />
          </div>
          {/* 모집 인원 */}
          <div className=" font-bold mt-3">모집 인원</div>

          {/* 기간 입력 */}
          <div className=" font-bold mt-3">일정 기간</div>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              name="startDate"
              value={productData.startDate}
              onChange={handleChange}
              className="border p-2 rounded-lg cursor-pointer"
            />
            <span>~</span>
            <input
              type="date"
              name="endDate"
              value={productData.endDate}
              onChange={handleChange}
              className="border p-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <h2 className=" font-bold mt-5 mb-4">상품 이미지 업로드</h2>
          <ImageUpload onUpload={handleFileUpload} type="prod" />
        </div>

        {/* 설명 */}
        <div className="relative w-full h-[209px] mt-5 font-bold">
          설명
          <TextInput
            name="description"
            value={productData.description}
            onChange={handleChange}
            error={''}
            className="mt-2 w-[331px] h-[175px]"
          />
        </div>

        {/* 등록하기 버튼 */}
        <div className="mt-6 mb-20">
          <Button variant="primary" className="w-full " onClick={handleSubmit}>
            등록하기
          </Button>
        </div>
      </div>
    </SignupLayout>
  );
};

export default ProductRegister;
