import { useNavigate } from "react-router-dom";
import IList from "../../components/features/list/IList";




const SalesList = () => { 
    const navigate = useNavigate();

    const handleBackClick =()=> {
        navigate(-1); 
    }



    return (
        <div className="flex flex-col">
        {/* 상단 헤더 (고정) */}
            <div className="bg-primary-500 p-1 flex items-center justify-between sticky top-0 z-10 w-full">             
            <button onClick={handleBackClick} className="text-white text-xl font-semibold">
                    &#8592;</button>
                
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
            판매 내역
                </h1>
                                   
            </div>
            <div className="flex flex-col gap-2 mt-8">
                <IList />
                </div>
      </div>  
    );
}

export default SalesList;

