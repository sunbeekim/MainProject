import { useNavigate } from 'react-router-dom';


interface DeleteModalProp{
onClose?: () => void;
}

const DeleteModal = ({ onClose = () => {} } : DeleteModalProp) => {
  const navigate = useNavigate();

    const handleDelete = () => {  
    navigate('/registered-cards');
  };

 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-[300px] h-[167px] p-4 bg-white rounded-2xl flex-col justify-start items-center gap-5 inline-flex">
        <div className="self-stretch h-[75px] p-2 flex-col justify-start items-center gap-2 flex">
          <div className="self-stretch text-center text-[#1f2024] text-base font-extrabold font-['Inter'] tracking-tight">
            등록된 카드 삭제
          </div>
          <div className="self-stretch text-center text-[#71727a] text-xs font-normal font-['Inter'] leading-none tracking-tight">
            선택한 카드를 정말 삭제하시겠습니까까?
          </div>
        </div>
        <div className="self-stretch justify-start items-start gap-2 inline-flex">
          <button
            onClick={onClose}
            className="grow shrink basis-0 h-10 px-4 py-3 rounded-xl border border-purple-400 justify-center items-center gap-2 flex overflow-hidden  bg-[#ffffff] hover:bg-purple-500"
          >
            <div className="text-[#4A4A4A] text-xs font-semibold font-['Inter']">취소</div>
          </button>
          <button
            onClick={handleDelete}
            className="grow shrink basis-0 h-10 px-4 py-3 bg-purple-400 rounded-xl justify-center items-center gap-2 flex overflow-hidden hover:bg-purple-500"
          >
            <div className="text-white text-xs font-semibold font-['Inter']">카드 삭제</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
