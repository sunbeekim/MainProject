export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface IChatProps {
  title: string;
  subtitle?: string;
  messages: IChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
} 