import { useEffect, useState } from 'react';
import { myProdListApi } from '../../../services/api/authAPI';
import ProductCard from '../card/ProductCard';

interface Product {
    id: number;
    productCode: string;
    title: string;
    description: string;
    price: number;
    email: string;
    categoryId: number;
    hobbyId: number;
    transactionType: string;
    registrationType: string;
    maxParticipants: number;
    currentParticipants: number;
    days: string[];
    startDate: string;
    endDate: string;
    latitude: number | null;
    longitude: number | null;
    meetingPlace: string | null;
    address: string | null;
    createdAt: string;
    imagePaths: string[];
    thumbnailPath: string;
    nickname: string;
    bio: string;
    dopamine: number;
    visible: boolean;
}

const RequestsList = () => {
    const [buyRequests, setBuyRequests] = useState<Product[]>([]);
    const [sellRequests, setSellRequests] = useState<Product[]>([]);

    useEffect(() => {
        const fetchBuyRequests = async () => {
            try {
                const response = await myProdListApi('requests/buy');
                setBuyRequests(response.data); // 구매 요청 목록 상태 업데이트
            } catch (error) {
                console.error('구매 요청 목록을 불러오는 데 실패했습니다:', error);
            }
        };

        const fetchSellRequests = async () => {
            try {
                const response = await myProdListApi('requests/sell');
                setSellRequests(response.data); // 판매 요청 목록 상태 업데이트
            } catch (error) {
                console.error('판매 요청 목록을 불러오는 데 실패했습니다:', error);
            }
        };

        fetchBuyRequests();  // 구매 요청 목록 불러오기
        fetchSellRequests(); // 판매 요청 목록 불러오기
    }, []);

    return (
        <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2 ml-4 mt-4">내가 요청한 상품 목록 (구매)</h2>

            <div className="border-t border-gray-300 my-2" />

            <div>
                {buyRequests.map((product) => (
                    <ProductCard key={product.id} product={product} />  // 구매 요청 상품 카드 출력
                ))}
            </div>

            <div className="border-t border-gray-300 my-2" />

            <h2 className="text-lg font-semibold mb-2 ml-4 mt-2">내가 요청한 상품 목록 (판매)</h2>

            <div className="border-t border-gray-300 my-2" />

            <div>
                {sellRequests.map((product) => (
                    <ProductCard key={product.id} product={product} />  // 판매 요청 상품 카드 출력
                ))}
            </div>
        </div>
    );
};

export default RequestsList;
