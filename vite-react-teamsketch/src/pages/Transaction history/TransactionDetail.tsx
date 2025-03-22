import { useLocation } from 'react-router-dom';
import { Transactions } from '../../services/api/authAPI';

const TransactionDetail = () => {
  const location = useLocation();

  const {

    productId = 0,
    buyerEmail = "구매자 정보 없음",
    sellerEmail = "판매자 정보 없음",
    transactionStatus = "진행중",
    paymentStatus = "미완료",
    price = 0,
    description = "설명 없음",
    createdAt = [],
  } = location.state as Transactions || {};

  return (
    <div className="p-4">

      {/* 거래 세부 사항 */}
      <div className="mt-6">
        <div className="space-y-2 m-4 mb-28">
          <h2>거래 상세</h2>
          <p>상품 ID: {productId}</p>
          <p>구매자: {buyerEmail}</p>
          <p>판매자: {sellerEmail}</p>
          <p>거래 상태: {transactionStatus}</p>
          <p>결제 상태: {paymentStatus}</p>
          <p>가격: {price}P</p>
          <p>설명: {description}</p>
          <p>거래 일자: {createdAt.join("-")}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
