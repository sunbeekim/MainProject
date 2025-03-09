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
