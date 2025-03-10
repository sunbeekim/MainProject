const PaymentMethod=()=>{

    return(
        <div className="p-4">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">등록된 카드</h2>
        </div>
  
        {/* 등록된 카드 리스트 */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-white shadow-md p-3 rounded-lg">
            <img src="" className="w-20 h-12 object-cover rounded-md" />
            <span className="text-lg font-semibold">체크카드</span>
          </div>
          <div className="flex items-center gap-4 bg-white shadow-md p-3 rounded-lg">
            <img src="" className="w-20 h-12 object-cover rounded-md" />
            <span className="text-lg font-semibold">신용카드</span>
          </div>
                <div className="text-xl font-bold">간편 결제</div>

        {/* 간편결제 */}
        <div className="space-y-3 mt-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="toss"
              className="h-5 w-5"
            />
            <span className="text-lg">토스페이</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="kakao"
              className="h-5 w-5"
            />
            <span className="text-lg">카카오페이</span>
          </label>
        </div>
        </div>
      </div>
    );
}
export default PaymentMethod;