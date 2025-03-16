import { useParams } from 'react-router-dom';
import {  useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetCardInfo } from '../../store/slices/cardSlice';
import { RootState } from '../../store/store';
import creditCardImg from './cardchip.png';

const CardDetails = () => {
  const { cardId } = useParams();
  

  const dispatch = useAppDispatch();
  const cardState = useAppSelector((state: RootState) => state.cardInfo);
  dispatch(resetCardInfo()); // 리덕스 스토어에 저장된 카드 정보 초기화
  console.log('초기화 된 카드 정보', cardState);

  // 카드 정보 상태 관리
  const [cardInfo, setCardInfo] = useState({
    name: '',
    number: '',
    expiryDate: '',
    owner: ''
  });

 // OCR에서 추출한 카드 정보 (테스트용 더미 데이터)
 const exampleOCRResponse = {
  name: "Shinhan Card", 
  number: "1234123412341234", 
  owner: "HONG GIL DONG",
  expiryDate: "12/29", 
};

// 버튼 클릭 시 OCR 결과를 카드 UI에 반영
const handleOCRResult = () => {
  setCardInfo(exampleOCRResponse);
  };
  
  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 저장 버튼 클릭 시 (API 연결 없이 콘솔 확인)
  const handleSave = () => {
    console.log('저장된 카드 정보:', cardInfo);
    alert('카드 정보가 저장되었습니다! (실제 저장은 API 연동 후 가능)');
  };

  

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">카드 상세 정보</h2>
      <p className="text-gray-600 mb-4">카드 ID: {cardId}</p>
      
      {/* 카드 모양 UI */}
      <div className="w-96 h-56 relative bg-gradient-to-r from-purple-400 to-violet-500 text-white p-6 rounded-xl shadow-md mb-4 ">
        <div className="text-lg font-semibold">{cardInfo.name || '카드 이름'}</div>
        <img src={creditCardImg} alt="Card Chip" className="w-12 h-10 absolute top-14 left-5" />
         <div className="mt-12 text-2xl font-bold tracking-widest text-gray-100">
          {cardInfo.number ? cardInfo.number.replace(/(\d{4})/g, '$1 ') : '**** **** **** ****'}
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <span className="absolute bottom-5 left-5 text-base font-medium tracking-wider">{cardInfo.owner || '소유자 이름'}</span>
          <span className="text-gray-300 text-xs ">VALID THRU</span>
          <span className="ml-2 text-base font-semibold">{cardInfo.expiryDate || 'MM/YY'}</span>
        </div>
     
      </div>
      
      카드 정보 입력 폼
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="카드 이름"
          value={cardInfo.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="number"
          placeholder="카드 번호 (16자리)"
          value={cardInfo.number}
          maxLength={19} // 카드 번호 16자리 + 공백
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 16);
            setCardInfo((prev) => ({ ...prev, number: value.replace(/(\d{4})/g, '$1 ').trim() }));
          }}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="expiryDate"
          placeholder="만료일 (MM/YY)"
          value={cardInfo.expiryDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="owner"
          placeholder="카드 소유자 이름"
          value={cardInfo.owner}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSave}
          className="w-full bg-secondary text-white py-2 rounded hover:bg-secondary-dark"
        >
          저장하기
        </button>
        
      </div>
      <button
        onClick={handleOCRResult}
        className="px-4 py-2 text-white rounded-full"
      >
        (테스트)
      </button>
    </div>
  );
};

export default CardDetails;
