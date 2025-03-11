
const TransactionList = () => {

    // const buyList = [
    //     { id: 1, item: "Item A", amount: 100 },
    //     { id: 2, item: "Item B", amount: 200 },
    //     { id: 3, item: "Item C", amount: 150 },
    //   ];
    
    //   const sellList = [
    //     { id: 1, item: "Item X", amount: 120 },
    //     { id: 2, item: "Item Y", amount: 250 },
    //     { id: 3, item: "Item Z", amount: 180 },
    //   ];

    return (
      <div className="flex flex-col">
        {/* 상단 헤더 (고정) */}
        <div className="bg-[#ECCEF5] p-5 flex items-center justify-between shadow-md sticky top-0 z-10 w-full">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[#330019] text-lg font-semibold">
            거래 내역
          </h1>
        </div>
  
        <ul>
          <li className="mt-3 border">
            구매 List
            <button className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark m-2">
              View All
            </button>
                </li>
              
          <li>----------------------------------------</li>
          <li>
            판매 List
            <button className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark m-2">
              View All
            </button>
          </li>
        </ul>
      </div>
    );
  };
  
  export default TransactionList;
  