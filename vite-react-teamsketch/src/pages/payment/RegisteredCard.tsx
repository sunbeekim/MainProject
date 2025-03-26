import { useNavigate } from "react-router-dom";
import CardItem from "./CardItem";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

const RegisteredCardList = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [showModal, setShowModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const handleAddCard = () => {
    navigate("/ocr-upload"); // useNavigate로 리다이렉션
  };

  const handleDeleteCard = (id: number) => {
    setSelectedCardId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCardId(null);
  };

  const handleConfirmDelete = (id: number) => {
    setCardList((prevList) =>
      prevList.filter((card) => card.id !== id));
    setShowModal(false);
    setSelectedCardId(null);
  };



  const [cardList, setCardList] = useState([
    { id: 1, type: "체크카드" },
    { id: 2, type: "신용카드" },
    { id: 3, type: "신용카드" },
  ]);

  return (
<<<<<<< HEAD
    <div className="max-w-2xl mx-auto p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">등록된 카드</h2>
        <span className="text-sm text-gray-500">{cardList.length}개의 카드</span>
      </div>
=======
    <div className="mt-5 space-y-4 p-4">
      <h2 className="text-xl font-bold mb-2 ml-4">등록된 카드</h2>
>>>>>>> ccf50cd17491fccab34bccb4bb908ecd4f47b44a

      {cardList.map((card) => (
        <CardItem
          key={card.id}
          type={card.type}
          onDelete={() => handleDeleteCard(card.id)}
        />
      ))}

      <div
        className="flex items-center justify-center gap-4 bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer mb-24"
        onClick={handleAddCard}
      >
<<<<<<< HEAD
        <svg
          className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-lg font-semibold text-primary-500 group-hover:text-primary-600">
          카드 등록하기
        </span>
      </button>
=======
        <span className="text-lg font-semibold ">➕ 카드 등록하기</span>
      </div>
>>>>>>> ccf50cd17491fccab34bccb4bb908ecd4f47b44a

      {/* 모달 */}
      {showModal && selectedCardId !== null && (
        <DeleteModal
          cardId={selectedCardId}
          onClose={handleCloseModal}
          onConfirmDelete={() => handleConfirmDelete(selectedCardId)}
        />
      )}
    </div>
  );
};

export default RegisteredCardList;
