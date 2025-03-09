import { axiosInstance, uploadInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';
import { IProductRegister, IProductResponse } from '../../types/product';

export const registerProduct = async (
  productData: Omit<IProductRegister, 'images'>,
  images: File[]
): Promise<IProductResponse> => {
  try {
    // 1. 상품 정보 등록
    const response = await axiosInstance.post(
      apiConfig.endpoints.core.registerProduct,
      productData
    );
    console.log('상품 등록 응답:', response.data);

    if (response.data.productId) {
      const productId = response.data.productId;

      // 2. 이미지가 있는 경우 이미지 업로드
      if (images?.length > 0) {
        try {
          const formData = new FormData();
          formData.append('productId', productId.toString());
          images.forEach((image) => {
            formData.append('files', image);
          });

          const imageResponse = await uploadInstance.post(
            apiConfig.endpoints.core.uploadProductImages,
            formData
          );
          console.log('이미지 업로드 응답:', imageResponse.data);

          return {
            status: 'success',
            data: {
              productId: productId,
              message: '상품과 이미지가 성공적으로 등록되었습니다.'
            }
          };
        } catch (error) {
          console.error('이미지 업로드 에러:', error);
          return {
            status: 'success',
            data: {
              productId: productId,
              message: '상품은 등록되었으나 이미지 업로드에 실패했습니다.'
            }
          };
        }
      }

      // 이미지가 없는 경우
      return {
        status: 'success',
        data: {
          productId: productId,
          message: '상품이 성공적으로 등록되었습니다.'
        }
      };
    }

    throw new Error('상품 등록에 실패했습니다.');
  } catch (error) {
    console.error('상품 등록 에러:', error);
    throw error;
  }
};

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
