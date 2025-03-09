export interface IProductRegister {
  title: string;
  description: string;
  price: number;
  email: string;
  categoryId: number | null;
  hobbyId: number | null;
  transactionType: '대면' | '비대면' | '';
  registrationType: '판매' | '구매' | '';
  maxParticipants: number;
  startDate: string;
  endDate: string;
  selectedDays: string[];
  latitude?: number;
  longitude?: number;
  meetingPlace?: string;
  address?: string;
  images: File[];
}

export interface IProductResponse {
  status: number;
  message: string;
  productId: number;
}
