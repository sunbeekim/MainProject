import { useEffect, useState } from "react";
import { transactionsListApi } from "../../services/api/authAPI";
import { toast } from "react-toastify";
import TransactionCard from "../../components/features/card/TransactionCard";

interface Transactions {
  id: number;
  productId: number;
  buyerEmail: string;
  sellerEmail: string;
  transactionStatus: '진행중' | '완료';
  paymentStatus: '미완료' | '완료';
  price: number;
  description: string;
  createdAt: number[];
}

const TransactionDetail = () => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);

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

  const handleTransactionClick = (transaction: Transactions) => {
    console.log(transaction);
  };

  return (
    <div className="p-4">
      {/* 거래 세부 사항 */}
      <div className="mt-6">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onClick={() => handleTransactionClick(transaction)}
            />
          ))
        ) : (
          <p>거래 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionDetail;
