import { useNavigate } from "react-router-dom";
import ListItem from "../../components/features/list/ListItem";

const TransactionList = () => {
  const navigate = useNavigate();

  const handleBackClick =()=> {
      navigate(-1); 
  }

  const handlePurchaseClick = () => { 
    navigate('/purchase-list');  
  };

  const handleSalesClick = () => { 
    navigate('/sales-list');  
  };

  const purchaseList = [
    { nickname: "곰탱이", title: "당신이 필요해요!", description: "같이 아침에 달리기 할 사람 찾아요!", points: 300, imageUrl: "https://picsum.photos/600/400"  },
    { nickname: "곰탱이", title: "제가 필요하신가요?", description: "축구/야구 잘해요.", points: 100, imageUrl: "https://picsum.photos/600/400"  },
  ];

  const salesList = [
    { nickname: "곰탱이", title: "당신이 필요해요!", description: "베드민턴 좀 치는 사람?", points: 200, imageUrl: "https://picsum.photos/600/400"  },
    { nickname: "곰탱이", title: "당신이 필요해요!", description: "근처 공원에서 강아지랑 산책하실 분!", points: 300, imageUrl: "https://picsum.photos/600/400"  },];
  
    
  

    return (
      <div className="flex flex-col">
      <div className="bg-[#ECCEF5] p-1 flex items-center justify-between sticky top-0 z-10 w-full">
        <button onClick={handleBackClick} className="text-white text-xl font-semibold">
          &#8592;
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[#330019] text-lg font-semibold">
          거래 내역
        </h1>
      </div>

      <ul>
        <li className="mt-3 flex justify-between items-center font-bold text-lg ml-4 mr-4">
          구매 List
          <button onClick={handlePurchaseClick} className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark m-2">
            View All
          </button>
        </li>
        <li className="my-2 border-t border-gray-300"></li>

          {/* 구매 내역에서 최신 2개만 전달 */}
          <div className="flex flex-col gap-2 items-center">
          {purchaseList.slice(0, 2).map((item, index) => (
          <li key={index}>
            <ListItem 
                nickname={item.nickname}
                title={item.title}
                description={item.description}
                points={item.points}
                imageUrl={item.imageUrl}
            />
          </li>
        ))}</div>
 

        <li className="my-2 border-t border-gray-300"></li>

        <li className="mt-2 flex justify-between items-center font-bold text-lg ml-4 mr-4">
          판매 List
          <button onClick={handleSalesClick} className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark m-2">
            View All
          </button>
        </li>
        <li className="my-3 border-t border-gray-300"></li>

          {/* 판매 내역에서 최신 2개만 전달 */}
          <div className="flex flex-col gap-2 items-center">
        {salesList.slice(0, 2).map((item, index) => (
          <li key={index}>
            <ListItem 
              nickname={item.nickname} 
              title={item.title} 
              description={item.description} 
              points={item.points}
              imageUrl={item.imageUrl}
            />
          </li>

        ))}</div>
        </ul>
        
    </div>
    );
  };
  
  export default TransactionList;
  