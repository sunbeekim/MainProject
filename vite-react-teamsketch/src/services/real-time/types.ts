export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  ENTER = 'ENTER',
  LEAVE = 'LEAVE',
  OFFER = 'OFFER'
}

export interface IChatMessage {
  messageId?: number;
  chatroomId: number;
  senderEmail: string;
  content: string;
  messageType: string;
  sentAt?: string;
  isRead?: boolean;
  senderName?: string;
  senderProfileUrl?: string;
  productId?: number;
}

export interface IChatMessageRequest {
  chatroomId: number;
  content: string;
  messageType: string;
}

export interface IChatRoom {
  chatroomId: number;
  chatname: string;
  productId: number;
  buyerEmail: string;
  sellerEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  productName?: string;
  productImageUrl?: string;
  otherUserName?: string;
}

export interface INotification {
  receiverEmail: string;
  message: string;
  timestamp?: string;
}

export interface WebSocketConfig {
  brokerURL: string;
  reconnectDelay: number;
  heartbeatIncoming: number;
  heartbeatOutgoing: number;
  debug?: boolean;
} 