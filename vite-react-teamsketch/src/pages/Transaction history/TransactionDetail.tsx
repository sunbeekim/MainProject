import { useLocation } from 'react-router-dom';

interface TransactionState {
  imageUrl: string;
  title: string;
  status: string;
  method: string;
  date: string;
  paymentStatus: string;
  price: number;
  description: string;
  opponentProfile: string;
  opponentNickname: string;
}

const TransactionDetail = () => {
  const location = useLocation();


  const {
    imageUrl = "https://picsum.photos/600/400",
    title = "상품명",
    status = "거래 상태 미제공",
    method = "거래 방식 미제공",
    date = "일정 미제공",
    paymentStatus = "결제 상태 미제공",
    price = "결제 금액",
    description = "설명 미제공",
    opponentProfile = "https://picsum.photos/100/100",
    opponentNickname = "상대방 닉네임 미제공",
  } = location.state as TransactionState || {};

  return (
    <div className="p-4">
      <div className="w-full h-[200px] bg-gray-200 rounded-lg">
        <img src={imageUrl} alt="상품 이미지" className="w-full h-full object-cover rounded-lg" />
      </div>

      {/* 거래명 */}
      <h2 className="text-2xl font-semibold mt-6 ml-4">{title}</h2>

      {/* 거래 세부 사항 */}
      <div className="mt-6">
        <ul className="space-y-2 m-4 mb-28">
          <li><strong>거래 상태:</strong> {status}</li>
          <li><strong>거래 방식:</strong> {method}</li>
          <li><strong>일정:</strong> {date}</li>
          <li><strong>결제 상태:</strong> {paymentStatus}</li>
          <li><strong>거래 금액:</strong> {price}</li>
          <li><strong>설명:</strong> {description}</li>
        </ul>
      </div>

      {/* 거래 상대 */}
      <h2 className="text-2xl font-semibold mt-6 ml-4">거래상대</h2>
      <div className="my-5 border-t border-gray-300"></div>

      <div className="flex items-center m-4">
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gray-200 mr-4">
          <img src={opponentProfile} alt="상대방 프로필" className="w-full h-full object-cover" />
        </div>
        <span className="text-lg font-semibold">{opponentNickname}</span>
      </div>
    </div>
  );
};

export default TransactionDetail;
