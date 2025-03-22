import { useNavigate } from "react-router-dom";
import ListItem from "../../components/features/list/ListItem";
import { useEffect, useState } from "react";
import { transactionsListApi } from "../../services/api/authAPI";
import { toast } from "react-toastify";

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionsListApi();
        if (response.status === "success") {
          setTransactions(response.data || []);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("결제 내역을 불러오는데 실패했습니다.");
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  // 구매 내역 필터링
  const purchaseList = transactions.filter(item => item.buyerEmail === "user@example.com");

  // 판매 내역 필터링
  const salesList = transactions.filter(item => item.sellerEmail === "user@example.com");

  const handlePurchaseClick = () => {
    navigate('/purchase-list');
  };

  const handleSalesClick = () => {
    navigate('/sales-list');
  };

  return (
    <div className="flex flex-col p-4">
      {/* 구매 내역 */}
      <div>
        <div
          onClick={handlePurchaseClick}
          className="flex justify-between items-center font-bold text-lg text-gray-800 mb-3">
          <span>구매 List</span>
          <button className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark">
            View All
          </button>
        </div>
        <div className="border-t border-gray-300 my-2" />
        <div className="flex flex-col gap-4">
          {purchaseList.slice(0, 2).map((item, index) => (
            <ListItem key={index} {...item} />
          ))}
        </div>
      </div>

      {/* 판매 내역 */}
      <div>
        <div className="flex justify-between items-center font-bold text-lg text-gray-800 mb-3 mt-2">
          <span>판매 List</span>
          <button
            onClick={handleSalesClick}
            className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark">
            View All
          </button>
        </div>
        <div className="border-t border-gray-300 my-2" />
        <div className="flex flex-col gap-4">
          {salesList.slice(0, 2).map((item, index) => (
            <ListItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
