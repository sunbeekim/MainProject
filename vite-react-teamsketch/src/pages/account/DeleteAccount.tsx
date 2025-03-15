import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
    const navigate = useNavigate();

    const handleBackClick = () => { 
        navigate(-1);
    }

    const handleDeleteAccount = () => {
        alert("계정이 삭제되었습니다.");
        navigate("/");
    }

    return (
        <div className="flex flex-col">
            <div className="bg-primary-500 p-1 flex items-center justify-between sticky top-0 z-10 w-full">
                <button onClick={handleBackClick} className="text-white text-xl font-semibold">
                    &#8592;
                </button>
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
                    회원 탈퇴
                </h1>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-4 mt-6">회원 탈퇴 안내</h2>
            <p className="text-center text-gray-600 mb-5">
                회원 탈퇴를 진행하시기 전에 아래 내용을 반드시 확인해주세요:
            </p>

            {/* 내용 박스 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full mb-6">
                <ul className="space-y-4 text-gray-700 m-3">
                    <li>
                        <strong>1. 재가입 제한</strong> <br />
                        회원 탈퇴 후, <span className="text-red-500 font-semibold">30일 이내에는 재가입이 불가능</span>합니다.
                    </li>
                    <li>
                        <strong>2. 데이터 삭제</strong> <br />
                        탈퇴 후 모든 개인정보 및 관련 데이터가 <span className="text-red-500 font-semibold">30일 보관 후 삭제</span>됩니다.
                        삭제된 데이터는 복구할 수 없습니다.
                    </li>
                    <li>
                        <strong>3. 서비스 이용 불가</strong> <br />
                        탈퇴 후, 해당 계정으로 상품 등록, 구매, 게시판 작성 등 <span className="text-red-500 font-semibold">서비스 이용이 불가능</span>합니다.
                    </li>
                    <li>
                        <strong>4. 환불 및 결제</strong> <br />
                        탈퇴 전, 진행 중인 거래나 결제 내역이 있을 경우 취소 및 환불이 필요한 경우 미리 처리해 주세요.
                    </li>
                </ul>
            </div>

            <p className="m-8 text-red-500 font-semibold text-center">
                <span>탈퇴 후에는 재가입이 불가능하고, 모든 데이터가 삭제됩니다.</span>
                <span className="text-black"> 이 점을 충분히 이해하신 후 탈퇴 절차를 진행해 주세요. 탈퇴를 원하시면, 아래 "계정 삭제" 버튼을 클릭해 주세요.</span>
            </p>

            {/* 계정 삭제 버튼 */}
            <button 
                onClick={handleDeleteAccount} 
                className="bg-gradient-to-r from-violet-500 to-purple-500 text-white py-3 w-full text-lg font-semibold rounded-lg shadow-md active:from-violet-700 active:to-purple-700 hover:from-violet-700 hover:to-purple-700 transition-all"
            >
                계정 삭제
            </button>
        </div>
    );
}

export default DeleteAccount;
