import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ListItemProps {
  transactionId: number;    // 거래 ID
  productId: number;        // 상품 ID
  buyerEmail: string;       // 구매자 이메일
  sellerEmail: string;      // 판매자 이메일
  transactionStatus: '진행중' | '완료'; // 거래 상태
  paymentStatus: '미완료' | '완료';    // 결제 상태
  price: number;            // 가격
  description: string;      // 설명
}

const ListItem: React.FC<ListItemProps> = ({
  transactionId,
  productId,
  buyerEmail,
  sellerEmail,
  transactionStatus,
  paymentStatus,
  price,

}) => {
  const navigate = useNavigate();

  // 상세보기 클릭 시 거래 상세 페이지로 이동
  const handleClick = () => {
    navigate(`/transaction-detail/${transactionId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full sm:w-[600px] h-auto bg-white rounded-2xl border-2 flex items-center p-4 gap-4">

        {/* 상품 ID를 제목처럼 표시 */}
        <div className="flex flex-col items-start mt-2">
          <h3 className="text-xl font-semibold text-gray-800">{productId}</h3>
        </div>

        {/* 거래 및 결제 상태 표시 */}
        <div className="flex flex-col items-start mt-2">
          <span className="text-xs text-gray-500">거래 상태: {transactionStatus}</span>
          <span className="text-xs text-gray-500">결제 상태: {paymentStatus}</span>
        </div>

        {/* 구매자 및 판매자 이메일 표시 */}
        <div className="flex flex-col items-start mt-2">
          <span className="text-xs text-gray-500">구매자 이메일: {buyerEmail}</span>
          <span className="text-xs text-gray-500">판매자 이메일: {sellerEmail}</span>
        </div>

        {/* 가격 표시 */}
        <div className="flex flex-col items-start mt-2">
          <span className="text-lg font-semibold text-gray-900">{price} 원</span>
        </div>

        {/* 상세보기 버튼 */}
        <button
          className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600 w-[120px] break-words"
          onClick={handleClick}
        >
          상세보기
        </button>
      </div>
    </div>
  );
};

export default ListItem;
