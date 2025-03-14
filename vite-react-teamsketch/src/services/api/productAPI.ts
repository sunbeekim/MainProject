import { axiosInstance, uploadInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';
import { 
  IProduct, 
  IProductRegisterRequest, 
  IProductRegisterResponse, 
  IProductListResponse 
} from '../../types/product';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 상품 등록
export const registerProduct = async (
  productData: Omit<IProductRegisterRequest, 'images'>,
  images: File[]
): Promise<IProductRegisterResponse> => {

  let count = 0;
  try {
    const formData = new FormData();
    
    // 상품 데이터를 JSON 문자열로 변환하여 추가
    formData.append(
      'request',
      new Blob([JSON.stringify(productData)], {
        type: 'application/json'
      })
    );

    // 이미지 파일들 추가 (중복 제거)
    const uniqueImages = images.filter((image, index, self) =>
      index === self.findIndex((img) => img.name === image.name && img.size === image.size)
    );

    uniqueImages.forEach((image) => {
      formData.append('images', image);
      count++;
      console.log('이미지 추가:', image.name, 'count:', count);
    });
    console.log('formData', formData);
    console.log('uniqueImages', uniqueImages);

    const response = await uploadInstance.post(apiConfig.endpoints.core.registerProduct, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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
let count2 = 0;
// 상품 이미지 조회
export const getProductImage = async (imageId: number): Promise<Blob | null> => {
  try {
    const response = await axiosInstance.get(apiConfig.endpoints.core.getProductImage(imageId), {
      responseType: 'blob'
    });
    count2++;
    console.log('상품 이미지 조회 성공:', imageId, 'count:', count2);
    return response.data;
  } catch (err: any) {
    // 404 에러는 자세한 로그를 출력하지 않음
    if (err.response && err.response.status === 404) {
      console.log(`이미지 ID ${imageId}를 찾을 수 없습니다.`);
    } else {
      console.error('상품 이미지 조회 에러:', err);
    }
    return null;
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
    enabled: !!imageId,
    retry: false, // 실패 시 재시도하지 않음
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 가비지 컬렉션 방지
  });
};

interface RegisterProductParams {
  productData: Omit<IProductRegisterRequest, 'images'>;
  images: File[];
}

export const useRegisterProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IProductRegisterResponse, Error, RegisterProductParams>({
    mutationFn: ({ productData, images }) => registerProduct(productData, images),
    onSuccess: (data) => {
      console.log('상품 등록 성공:', data);
      // 상품 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['products'] });
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