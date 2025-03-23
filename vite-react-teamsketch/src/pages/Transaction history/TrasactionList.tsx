import { useNavigate } from "react-router-dom";
import ListItem from "../../components/features/list/ListItem";

const TransactionList = () => {
  const navigate = useNavigate();

  const handlePurchaseClick = () => {
    navigate('/purchase-list');
  };

  const handleSalesClick = () => {
    navigate('/sales-list');
  };

  const purchaseList = [
    { nickname: "곰탱이", title: "당신이 필요해요!", description: "같이 아침에 달리기 할 사람 찾아요!", points: 300, imageUrl: "https://picsum.photos/600/400" },
    { nickname: "곰탱이", title: "제가 필요하신가요?", description: "축구/야구 잘해요.", points: 100, imageUrl: "https://picsum.photos/600/400" },
  ];

  const salesList = [
    { nickname: "곰탱이", title: "당신이 필요해요!", description: "베드민턴 좀 치는 사람?", points: 200, imageUrl: "https://picsum.photos/600/400" },
    { nickname: "곰탱이", title: "당신이 필요해요!", description: "근처 공원에서 강아지랑 산책하실 분!", points: 300, imageUrl: "https://picsum.photos/600/400" },];




  return (
    <div className="flex flex-col p-4">
      {/* 구매 리스트 섹션 */}
      <div className="mb-6">
        <div className="flex justify-between items-center font-bold text-lg text-gray-800 mb-3">
          <span>구매 List</span>
          <button
            onClick={handlePurchaseClick}
            className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark"
          >
            View All
          </button>
        </div>
        <div className="border-t border-gray-300 my-2" />

        {/* 구매 내역에서 최신 2개만 표시 */}
        <div className="flex flex-col gap-4">
          {purchaseList.slice(0, 2).map((item, index) => (
            <ListItem
              key={index}
              nickname={item.nickname}
              title={item.title}
              description={item.description}
              points={item.points}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-gray-300 my-2" />
      {/* 판매 리스트 섹션 */}
      <div>
        <div className="flex justify-between items-center font-bold text-lg text-gray-800 mb-3 mt-2">
          <span>판매 List</span>
          <button
            onClick={handleSalesClick}
            className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark"
          >
            View All
          </button>
        </div>
        <div className="border-t border-gray-300 my-2" />

        {/* 판매 내역에서 최신 2개만 표시 */}
        <div className="flex flex-col gap-4 mb-20">
          {salesList.slice(0, 2).map((item, index) => (
            <ListItem
              key={index}
              nickname={item.nickname}
              title={item.title}
              description={item.description}
              points={item.points}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>

  );
};

export default TransactionList;
