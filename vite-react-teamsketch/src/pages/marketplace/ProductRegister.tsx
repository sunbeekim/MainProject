import React, { useState } from "react";
import TextInput from '../../components/forms/input/TextInput';
import RadioButton from '../../components/common/RadioButton'; 
import InterestSelect from '../../components/forms/select/InterestSelect'; 
import Button from '../../components/common/Button'; 
import SignupLayout from "../../components/layout/SignupLayout";
import ImageSelector from '../../components/features/upload/ImageSelector';

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
    images:[] as File [],
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

  const handleFileSelect = (file: File) => {
    setProductData((prevState) => ({
      ...prevState,
      images: [...prevState.images, file], 
    }));
  };

  const handleLocationClick = () => {
    alert("장소 지정하는 기능 구현"); 
  };
  const handleSubmit = () => {
    console.log("등록하기 버튼 클릭됨", productData);
   
  };

  return (
    <SignupLayout>
    <div className="p-4">
      <h1 className="text-xl font-semibold text-center ">상품 등록</h1>

      <div className="flex flex-col  gap-4">
          {/* 제목 */}
          <div className=" font-bold mt-4 ">제목</div>
        <TextInput          
          name="title"
          value={productData.title}
          onChange={handleChange}
            error={""}
        />

          {/* 가격 */}
          <div className=" font-bold mt-3">가격</div>
        <TextInput
          name="price"
          value={productData.price}
          onChange={handleChange}
          error={""}
        />

         {/* 대면/비대면 라디오 버튼 */}
          <div className="flex gap-4 font-bold"> 거래 방식
                      
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
  <input
      type="radio"
      id="faceToFace"
      name="transactionType"
      value="faceToFace"
      onChange={() => handleRadioButtonChange('transactionType', 'faceToFace')}
      checked={productData.transactionType === 'faceToFace'}
      className="h-4 w-4"
    />
  <label htmlFor="faceToFace">대면</label>
  
  <input
      type="radio"
      id="nonFaceToFace"
      name="transactionType"
      value="nonFaceToFace"
      onChange={() => handleRadioButtonChange('transactionType', 'nonFaceToFace')}
      checked={productData.transactionType === 'nonFaceToFace'}
      className="h-4 w-4"
    />
    
  <label htmlFor="nonFaceToFace">비대면</label>



           {/* 대면 선택 시 장소 지정하기 버튼 */}
        {productData.transactionType === 'faceToFace' && (
          <button onClick={handleLocationClick}              
           className="bg-primary-light hover:bg-primary text-white font-bold" >장소 지정
            </button>
        )}
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
        <div className=" font-bold mt-4">카테고리</div>
          <div>
          <InterestSelect 
            onInterestSelect={handleInterestSelect} 
            selectedInterest={productData.category} 
          />
        </div>

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
        <div className="font-bold mt-5 mb-4">이미지 업로드</div>
        <ImageSelector onFileSelect={handleFileSelect}/>
        
        {/* 설명 */}
        <div className="relative w-full h-[209px] mt-5 font-bold">설명
          <TextInput
            name="description"
            value={productData.description}
            onChange={handleChange}
            error={""}
            className="mt-2 w-[331px] h-[175px]"
          />
        </div>

            {/* 등록하기 버튼 */}
            <div className="mt-6 mb-20">
          <Button  variant="primary" className="w-full " onClick={handleSubmit}>
            등록하기
          </Button>
        </div>
       </div>

    </SignupLayout>
  );
};

export default ProductRegister;
