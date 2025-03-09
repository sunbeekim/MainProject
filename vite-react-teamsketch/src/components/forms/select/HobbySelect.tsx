import { useEffect } from 'react';
import Select from "../../common/Select";   
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { axiosInstance } from "../../../services/api/axiosInstance";
import { apiConfig } from "../../../services/api/apiConfig";
import { setHobbies } from "../../../store/slices/categorySlice";

interface HobbySelectProps {
  onHobbySelect: (categoryId: number, hobbyId: number) => void;
  selectedHobbies?: Array<{
    hobbyId: number;
    categoryId: number;
  }>;
  categoryId?: number;
}

const HobbySelect: React.FC<HobbySelectProps> = ({ 
  onHobbySelect,
  selectedHobbies = [],
  categoryId,
}) => {
  const dispatch = useAppDispatch();
  const { hobbies } = useAppSelector(state => state.category);

  // 카테고리 ID가 변경될 때마다 해당 카테고리의 취미 목록을 가져옴
  useEffect(() => {
    const fetchHobbies = async () => {
      if (categoryId) {
        try {
          const response = await axiosInstance.get(
            apiConfig.endpoints.core.getHobbiesByCategory(categoryId)
          );
          if (response.data.status === 'success') {
            dispatch(setHobbies(response.data.data));
          }
        } catch (error) {
          console.error('취미 목록 로딩 중 오류:', error);
        }
      }
    };

    fetchHobbies();
  }, [categoryId, dispatch]);

  const handleHobbySelect = (value: string) => {
    if (categoryId) {
      onHobbySelect(categoryId, Number(value));
    }
  };

  return (
    <Select 
      options={hobbies.map(hobby => ({
        value: hobby.hobbyId.toString(),
        label: hobby.hobbyName
      }))}
      onChange={handleHobbySelect}
      className="w-full"
      placeholder="취미를 선택해주세요"
      value={selectedHobbies.find(h => h.categoryId === categoryId)?.hobbyId.toString()}
      disabled={!categoryId} // 카테고리가 선택되지 않았으면 비활성화
    />
  );
};

export default HobbySelect;

