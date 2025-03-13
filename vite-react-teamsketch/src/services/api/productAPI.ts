import { axiosInstance, uploadInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';
import { 
  IProduct, 
  IProductRegisterRequest, 
  IProductRegisterResponse, 
  IProductListResponse 
} from '../../types/product';
import { useQuery, useMutation } from '@tanstack/react-query';

// 상품 등록
export const registerProduct = async (
  productData: Omit<IProductRegisterRequest, 'images'>,
  images: File[]
): Promise<IProductRegisterResponse> => {
  try {
    const formData = new FormData();

    formData.append(
      'request',
      new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      })
    );

    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    const response = await uploadInstance.post(apiConfig.endpoints.core.registerProduct, formData);
    return response.data;
  } catch (error) {
    console.error('상품 등록 에러:', error);
    throw new Error('상품 등록에 실패했습니다.');
  }
};

// 상품 목록 조회
export const getProducts = async (): Promise<IProductListResponse> => {
  try {
    const response = await axiosInstance.get(apiConfig.endpoints.core.getProducts);
    return response.data;
  } catch (err) {
    console.error('상품 목록 조회 에러:', err);
    throw new Error('상품 목록 조회에 실패했습니다.');
  }
};

// 상품 상세 조회
export const getProductById = async (id: number): Promise<IProduct> => {
  try {
    const response = await axiosInstance.get(`${apiConfig.endpoints.core.getProductById}/${id}`);
    return response.data.data;
  } catch (err) {
    console.error('상품 상세 조회 에러:', err);
    throw new Error('상품 상세 조회에 실패했습니다.');
  }
};

// 상품 이미지 조회
export const getProductImage = async (imageId: number): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(apiConfig.endpoints.core.getProductImage(imageId), {
      responseType: 'blob'
    });
    return response.data;
  } catch (err) {
    console.error('상품 이미지 조회 에러:', err);
    throw new Error('상품 이미지 조회에 실패했습니다.');
  }
};

// 상품 이미지 URL 생성 유틸리티 함수
export const createProductImageUrl = (imageId: number): string => {
  return apiConfig.endpoints.core.getProductImage(imageId);
};

// 상품 이미지 URL에서 ID 추출 유틸리티 함수
export const extractImageIdFromPath = (thumbnailPath: string): number | null => {
  try {
    // URL에서 마지막 숫자를 추출
    const matches = thumbnailPath.match(/\d+$/);
    return matches ? parseInt(matches[0]) : null;
  } catch (error) {
    console.error('이미지 ID 추출 에러:', error);
    return null;
  }
};

// React Query Hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts()
  });
};

export const useProductById = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id
  });
};

export const useProductImage = (imageId: number) => {
  return useQuery({
    queryKey: ['productImage', imageId],
    queryFn: () => getProductImage(imageId),
    enabled: !!imageId
  });
};

interface RegisterProductParams {
  productData: Omit<IProductRegisterRequest, 'images'>;
  images: File[];
}

export const useRegisterProduct = () => {
  return useMutation<IProductRegisterResponse, Error, RegisterProductParams>({
    mutationFn: ({ productData, images }) => registerProduct(productData, images),
    onSuccess: (data) => {
      console.log('상품 등록 성공:', data);
    },
    onError: (error) => {
      console.error('상품 등록 실패:', error);
    }
  });
};

// =================================================================================

// 좌표로 주소 정보 가져오기
export const getAddressFromCoord = async (lat: number, lng: number) => {
  try {
    const response = await axiosInstance.get(apiConfig.endpoints.assist.coordToAddress, {
      params: {
        lat,
        lng
      }
    });

    if (response.data.documents && response.data.documents.length > 0) {
      const addressInfo = response.data.documents[0];
      const roadAddress = addressInfo.road_address;
      const address = addressInfo.address;

      // 도로명 주소가 있는 경우 우선 사용
      const fullAddress = roadAddress
        ? `${roadAddress.building_name || ''} ${roadAddress.address_name}`.trim()
        : address.address_name;

      return {
        address: fullAddress,
        name: roadAddress?.building_name || address.address_name
      };
    }
    return {
      address: '주소를 찾을 수 없습니다.',
      name: '선택된 위치'
    };
  } catch (error) {
    console.error('주소 변환 중 오류:', error);
    return {
      address: '주소 변환 중 오류가 발생했습니다.',
      name: '선택된 위치'
    };
  }
};

export interface SearchResult {
  address_name: string;
  road_address_name: string;
  place_name: string;
  category_name: string;
  phone: string;
  x: string; // 경도
  y: string; // 위도
}

export interface KakaoApiResponse {
  documents: SearchResult[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

// 주소 검색
export const searchAddress = async (query: string) => {
  const response = await axiosInstance.get<KakaoApiResponse>(
    apiConfig.endpoints.assist.searchAddress,
    {
      params: { query }
    }
  );
  return response.data;
};