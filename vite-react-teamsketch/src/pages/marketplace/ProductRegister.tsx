import React, { useState } from 'react';
import TextInput from '../../components/forms/input/TextInput';

import RadioButton from '../../components/common/RadioButton';
import InterestSelect from '../../components/forms/select/InterestSelect';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/features/upload/ImageUpload';
import TextAreaInput from '../../components/forms/textarea/TextAreaInput';
import PRLayout from '../../components/layout/PRLayout';
import { useNavigate } from 'react-router-dom'; 

const ProductRegister = () => {
  const navigate = useNavigate();
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
    images: [] as File[],
    participants: 0
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleIncrement = () => {
    setProductData((prevState) => ({
      ...prevState,
      participants: prevState.participants + 1
    }));
  };
  const handleDecrement = () => {
    setProductData((prevState) => ({
      ...prevState,
      participants: prevState.participants > 0 ? prevState.participants - 1 : 0
    }));
  };

  const handleLocationClick = () => {
    navigate('/product/location');
  };
  const handleSubmit = () => {
    console.log('등록하기 버튼 클릭됨', productData);
  };

  return (
    <PRLayout
      title={<h1>상품 등록</h1>}
      productTitle={
        <TextInput 
          name="title" 
          value={productData.title} 
          onChange={handleChange} 
          error={''} 
        />
      }
      price={
        <TextInput 
          name="price" 
          value={productData.price} 
          onChange={handleChange} 
          error={''} 
        />
      }
      transactionType={
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
          <div className="flex justify-end">
            {productData.transactionType === 'faceToFace' && (
              <Button variant="primary" className="w-full" onClick={handleLocationClick}>
                장소
              </Button>
            )}
          </div>
        </div>
      }
      registrationType={
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
      }
      category={
        <div>
          <InterestSelect
            onInterestSelect={handleInterestSelect}
            selectedInterest={productData.category}
          />
        </div>
      }
      participants={
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleDecrement}
            className="border p-2 rounded-md hover:bg-primary-light w-7 h-7 flex items-center justify-center "
          >
            -
          </button>
          <span>{productData.participants}</span>
          <button
            type="button"
            onClick={handleIncrement}
            className="border p-2 rounded-md hover:bg-primary-light w-7 h-7 flex items-center justify-center"
          >
            +
          </button>
        </div>
      }
      schedule={
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
      }
      images={
        <ImageUpload onUpload={handleFileUpload} type="prod" className="mb-6" />
      }
      description={
        <TextAreaInput
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="소개글을 입력하세요"
          className="mt-2 h-[140px]"
        />
      }
      submitButton={
        <Button variant="primary" className="w-full" onClick={handleSubmit}>
          등록하기
        </Button>
      }
    />
  );
};

export default ProductRegister;
