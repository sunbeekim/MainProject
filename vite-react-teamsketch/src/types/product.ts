export interface IProductRegister {
  title: string;
  description: string;
  price: number;
  email: string;
  categoryId?: number;
  transactionType: string;
  registrationType: string;
  meetingPlace?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  images?: File[];
  maxParticipants?: number;
  selectedDays?: string[];
  startDate?: string;
  endDate?: string;
  hobbyId?: number;
}

export interface IProductResponse {
  status: 'success' | 'error';
  data: {
    productId: number;
    message: string;
  };
  code?: string;
}

export interface IImageResponse {
  status: 'success' | 'error';
  data: {
    message: string;
    response: any;
  };
  code: string;
}

// 전체 상품 조회 응답 인터페이스
export interface IGetProduct {
  id: number;
  productCode: string;
  title: string;
  description: string;
  price: number;
  email: string;
  categoryId: number;
  hobbyId: number;
  transactionType: '대면' | '비대면';
  registrationType: '판매' | '구매';
  maxParticipants: number;
  startDate: string; // ISO 8601 형식의 날짜 문자열
  endDate: string; // ISO 8601 형식의 날짜 문자열
  latitude: number | null;
  longitude: number | null;
  meetingPlace: string | null;
  address: string | null;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  imagePaths: string[];
  thumbnailPath: string | null;
}

// 상품 목록 조회 응답 인터페이스
export type IGetProductListResponse = IGetProduct[];

// 단일 상품 조회 응답 인터페이스 (수정)
export interface IGetProductDetailResponse {
  id: number;
  productCode: string;
  title: string;
  description: string;
  price: number;
  email: string;
  categoryId: number;
  hobbyId: number;
  transactionType: '대면' | '비대면';
  registrationType: '판매' | '구매';
  maxParticipants: number;
  startDate: string;
  endDate: string;
  latitude: number | null;
  longitude: number | null;
  meetingPlace: string | null;
  address: string | null;
  createdAt: string;
  imagePaths: string[];
  thumbnailPath: string | null;
}

// 단일 상품 조회 응답 인터페이스
export interface IGetProductResponse {
  status: 'success' | 'error';
  data: {
    product: IGetProduct;
  };
  message?: string;
  code?: string;
}

// 상품 필터 옵션 인터페이스 (추가)
export interface IProductFilter {
  categoryId?: number;
  sort?: 'price' | 'createdAt';
}

export interface IProductFilter{
  categoryId?: number;
  sort?: 'price' | 'createdAt';
}

