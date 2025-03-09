import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCategories, setHobbies, setLoading, setError } from '../store/slices/categorySlice';
import { axiosInstance } from '../services/api/axiosInstance';
import { apiConfig } from '../services/api/apiConfig';

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const { categories, hobbies, selectedCategoryId, loading, error } = useAppSelector(
    (state) => state.category
  );

  const fetchCategories = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(apiConfig.endpoints.core.getCategory);
      if (response.data.status === 'success') {
        dispatch(setCategories(response.data.data));
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : '카테고리 로딩 중 오류가 발생했습니다.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchHobbiesByCategory = async (categoryId: number) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(
        apiConfig.endpoints.core.getHobbiesByCategory(categoryId)
      );
      if (response.data.status === 'success') {
        dispatch(setHobbies(response.data.data));
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : '취미 로딩 중 오류가 발생했습니다.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    hobbies,
    selectedCategoryId,
    loading,
    error,
    fetchHobbiesByCategory
  };
};
