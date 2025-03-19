import { useNavigate } from "react-router-dom";
import IList from "../../components/features/list/IList";
const MyProducts = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <div className="flex flex-col">
            {/* 상단 헤더 (고정) */}
            <div className="bg-primary-500 p-1 flex items-center justify-between sticky top-0 z-10 w-full">
                <button onClick={handleBackClick} className="text-white text-xl font-semibold">
                    &#8592;</button>

                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
                    상품 관리
                </h1>
            </div>
            <ul>
                <li className="mt-3 flex justify-between items-center font-bold text-lg ml-4 mr-4 p-3 ">내가 등록한 상품 목록

                </li>

                <li className="my-3 border-t border-gray-300"></li>
                <div className="flex flex-col gap-2 mt-8">
                    <IList /></div>
            </ul>
        </div>
    );
}

export default MyProducts;