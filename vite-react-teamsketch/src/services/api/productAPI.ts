import { axiosInstance, uploadInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';
import { IProductRegister, IProductResponse } from '../../types/product';

export const registerProduct = async (productData: Omit<IProductRegister, 'images'>, images: File[]): Promise<IProductResponse> => {
  try {
    // 1. 상품 정보 등록
    const response = await axiosInstance.post(apiConfig.endpoints.core.registerProduct, productData);
    console.log('서버 응답:', response.data); // 전체 응답 구조 확인

    if (!response.data || response.data.status === 500) {
      throw new Error(response.data?.message || '상품 등록에 실패했습니다.');
    }

    // 응답 구조에 따라 productId 추출
    const productId = response.data.productId || response.data.data?.productId;
    if (!productId) {
      throw new Error('상품 ID를 받지 못했습니다.');
    }
    console.log('productId', productId);
    // 2. 이미지가 있는 경우 이미지 업로드
    if (images?.length > 0) {
      const formData = new FormData();
      formData.append('productId', productId.toString());
      images.forEach(image => {
        formData.append('files', image);
      });

      await uploadInstance.post(
        apiConfig.endpoints.core.uploadProductImages, 
        formData
      );
    }

    return response.data;
  } catch (error) {
    console.error('상품 등록 에러:', error);
    throw error;
  }
};


// 좌표로 주소 정보 가져오기
export const getAddressFromCoord = async (lat: number, lng: number) => {
  try {
    const response = await axiosInstance.get( 
      apiConfig.endpoints.assist.coordToAddress,
      {
        params: {
          lat,
          lng
        }
      }
    );

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
  const response = await axiosInstance.get<KakaoApiResponse>(apiConfig.endpoints.assist.searchAddress, {
    params: { query }
  });
  return response.data;
};  

