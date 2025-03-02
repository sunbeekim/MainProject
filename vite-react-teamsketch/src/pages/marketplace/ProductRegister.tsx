import React, { useState } from "react";
import TextInput from '../../components/forms/input/TextInput';
import RadioButton from '../../components/common/RadioButton'; 
import InterestSelect from '../../components/forms/select/InterestSelect'; 
const ProductRegister = () => {
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    category: '', 
    transactionType: '', 
    registrationType: '', 
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRadioButtonChange = (field: string, value: string) => {
    setProductData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleInterestSelect = (value: string) => {
    setProductData((prevState) => ({
      ...prevState,
      category: value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Product Add</h1>

      <div className="flex flex-col gap-4 mt-4">
        {/* 제목 */}
        <TextInput
          label="제목"
          name="title"
          value={productData.title}
          onChange={handleChange}
          error={""}
        />

        {/* 가격 */}
        <TextInput
          label="가격"
          name="price"
          value={productData.price}
          onChange={handleChange}
          error={""}
        />

         {/* 대면/비대면 라디오 버튼 */}
         <div className="flex gap-4 mt-4 font-bold ">거래 방식
          <RadioButton
            label="대면"
            value="faceToFace"
            checked={productData.transactionType === 'faceToFace'}
            onChange={(value) => handleRadioButtonChange('transactionType', value)}
          />
          <RadioButton
            label="비대면"
            value="nonFaceToFace"
            checked={productData.transactionType === 'nonFaceToFace'}
            onChange={(value) => handleRadioButtonChange('transactionType', value)}
          />
        </div>

        {/* 등록 유형 (구매/판매) 라디오 버튼 */}
        <div className="flex gap-4 font-bold">등록 유형
          <RadioButton
            label="판매"
            value="sale"
            checked={productData.registrationType === 'sale'}
            onChange={(value) => handleRadioButtonChange('registrationType', value)}
          />
          <RadioButton
            label="구매"
            value="buy"
            checked={productData.registrationType === 'buy'}
            onChange={(value) => handleRadioButtonChange('registrationType', value)}
          />
        </div>

       
        {/* 카테고리 */}
        <div className=" font-bold mt-4">카테고리
          <InterestSelect 
            onInterestSelect={handleInterestSelect} 
            selectedInterest={productData.category} 
          />
        </div>

        {/* 설명 */}
        <div className="relative w-full h-[209px] mt-4">
          <TextInput
            label="설명"
            name="description"
            value={productData.description}
            onChange={handleChange}
            error={""}
            className="mt-2 w-[331px] h-[174px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductRegister;
