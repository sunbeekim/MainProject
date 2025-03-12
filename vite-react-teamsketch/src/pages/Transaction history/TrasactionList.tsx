import { useNavigate } from "react-router-dom";


const TransactionList = () => {
  const navigate = useNavigate();

  const handleBackClick =()=> {
      navigate(-1); 
  }

  const handleBuyClick = () => { 
    navigate('/buy-list');  
  };

  const handleSellClick = () => { 
    navigate('/sell-list');  
  };


    return (
      <div className="flex flex-col">
        
        {/* 상단 헤더 (고정) */}
        <div className="bg-[#ECCEF5] p-1 flex items-center justify-between  sticky top-0 z-10 w-full">
        <button onClick={handleBackClick} className="text-white text-xl font-semibold">
                    &#8592;</button>
                
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[#330019] text-lg font-semibold">
            거래 내역
          </h1>
        </div>
  
        <ul>
          <li className="mt-3 flex justify-between items-center font-bold text-lg ml-4 mr-4">
            구매 List
            <button onClick={handleBuyClick} className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark m-2">
              View All
            </button>
                </li>
              
          <li className="my-2 border-t border-gray-300"></li>

          [구매 리스트]


          <li className="my-2 border-t border-gray-300"></li>
          
          <li className="mt-2 flex justify-between items-center font-bold text-lg ml-4 mr-4">
            판매 List
            <button onClick={handleSellClick} className="bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark m-2">
              View All
            </button>
          </li>

          <li className="my-2 border-t border-gray-300"></li>

          [판매 리스트]

        </ul>
      </div>
    );
  };
  
  export default TransactionList;
  