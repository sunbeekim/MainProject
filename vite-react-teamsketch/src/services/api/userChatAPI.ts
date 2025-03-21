import { axiosInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';
import { useQuery, useMutation } from '@tanstack/react-query';

// 채팅방 목록 조회 응답 타입 정의
export interface ChatRoom {
  chatroomId: number;
  chatname: string;
  productId: number;
  productName: string;
  productImageUrl: string;
  sellerEmail: string;
  buyerEmail: string;
  otherUserEmail: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  messages?: IMessage[];
}

export interface IMessage {
  messageId: number;
  chatroomId: number;
  senderEmail: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatRoomsResponse {
  status: string;
  data: {
    success: boolean;
    message: string;
    chatRooms: ChatRoom[];
  };
  code: string;
}

export interface ChatRoomResponse {
  status: string;
  data: {
    success: boolean;
    message: string;
    chatRoom: ChatRoom;
  };
  code: string;
}

export interface ChatRoomRequest {
  productId: number;
  sellerEmail?: string;
  buyerEmail?: string;
}

// 채팅방 목록 조회 API 함수
export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    const response = await axiosInstance.get<ChatRoomsResponse>(apiConfig.endpoints.core.getChatRooms);
    
    // 성공 응답 처리
    if (response.data.status === 'success' && response.data.data.success) {
      console.log('채팅방 목록 조회 성공:', response.data.data.chatRooms);
      return response.data.data.chatRooms;
    } else {
      console.error('채팅방 목록 조회 실패:', response.data);
      throw new Error(response.data.data.message || '채팅방 목록을 가져오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('채팅방 목록 조회 오류:', error);
    throw error;
  }
};

// 채팅방 생성 또는 조회 함수
export const createChatRoom = async (request: ChatRoomRequest): Promise<ChatRoom> => {
  try {
    const response = await axiosInstance.post<ChatRoomResponse>(
      apiConfig.endpoints.core.createChatRoom,
      request
    );
    
    if (response.data.status === 'success' && response.data.data.success) {
      console.log('채팅방 생성/조회 성공:', response.data.data.chatRoom);
      return response.data.data.chatRoom;
    } else {
      console.error('채팅방 생성/조회 실패:', response.data);
      throw new Error(response.data.data.message || '채팅방을 생성하거나 조회하는데 실패했습니다.');
    }
  } catch (error) {
    console.error('채팅방 생성/조회 오류:', error);
    throw error;
  }
};

// 특정 채팅방 상세 정보 조회 함수
export const getChatRoomDetail = async (chatroomId: number): Promise<ChatRoom> => {
  try {
    const response = await axiosInstance.get<ChatRoomResponse>(
      apiConfig.endpoints.core.getChatRoomDetail(chatroomId)
    );
    
    if (response.data.status === 'success' && response.data.data.success) {
      console.log('채팅방 상세 조회 성공:', response.data.data.chatRoom);
      return response.data.data.chatRoom;
    } else {
      console.error('채팅방 상세 조회 실패:', response.data);
      throw new Error(response.data.data.message || '채팅방 상세 정보를 가져오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('채팅방 상세 조회 오류:', error);
    throw error;
  }
};

// 판매자가 '함께하기' 버튼 클릭 시 구매 요청 승인 함수
export const approveChatMember = async (chatroomId: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      apiConfig.endpoints.core.approveChatMember(chatroomId)
    );
    
    if (response.data.status === 'success') {
      console.log('채팅 멤버 승인 성공:', response.data);
      return response.data.data;
    } else {
      console.error('채팅 멤버 승인 실패:', response.data);
      throw new Error(response.data.message || '채팅 멤버 승인에 실패했습니다.');
    }
  } catch (error) {
    console.error('채팅 멤버 승인 오류:', error);
    throw error;
  }
};

// 메시지 읽음 상태 업데이트 함수
export const updateMessagesRead = async (chatroomId: number): Promise<any> => {
  try {
    const response = await axiosInstance.put(
      apiConfig.endpoints.core.updateMessagesRead(chatroomId)
    );
    
    if (response.data.status === 'success') {
      console.log('메시지 읽음 상태 업데이트 성공:', response.data);
      return response.data.data;
    } else {
      console.error('메시지 읽음 상태 업데이트 실패:', response.data);
      throw new Error(response.data.message || '메시지 읽음 상태 업데이트에 실패했습니다.');
    }
  } catch (error) {
    console.error('메시지 읽음 상태 업데이트 오류:', error);
    throw error;
  }
};

// 채팅방 메시지 전송 함수
export const sendChatMessage = async (
  roomId: number,
  message: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      apiConfig.endpoints.core.sendMessage(roomId),
      { content: message }
    );
    
    if (response.data.status === 'success') {
      console.log('메시지 전송 성공:', response.data);
      return response.data.data;
    } else {
      console.error('메시지 전송 실패:', response.data);
      throw new Error(response.data.message || '메시지 전송에 실패했습니다.');
    }
  } catch (error) {
    console.error('메시지 전송 오류:', error);
    throw error;
  }
};

// React Query Hooks

// 채팅방 목록 조회 Hook
export const useChatRooms = () => {
  return useQuery<ChatRoom[], Error>({
    queryKey: ['chatRooms'],
    queryFn: fetchChatRooms,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터 유지
    retry: 1,
    refetchOnWindowFocus: false
  });
};

// 채팅방 상세 정보 조회 Hook
export const useChatRoomDetail = (chatroomId: number) => {
  return useQuery<ChatRoom, Error>({
    queryKey: ['chatRoom', chatroomId],
    queryFn: () => getChatRoomDetail(chatroomId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!chatroomId // chatroomId가 존재할 때만 쿼리 실행
  });
};

// 채팅방 생성 Hook
export const useCreateChatRoom = () => {
  return useMutation({
    mutationFn: createChatRoom
  });
};

// 함께하기 버튼 승인 Hook
export const useApproveChatMember = () => {
  return useMutation({
    mutationFn: approveChatMember
  });
};

// 메시지 읽음 상태 업데이트 Hook
export const useUpdateMessagesRead = () => {
  return useMutation({
    mutationFn: updateMessagesRead
  });
};

// 채팅 메시지 전송 Hook
export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({roomId, message}: {roomId: number; message: string}) => 
      sendChatMessage(roomId, message)
  });
};
