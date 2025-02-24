import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatState {
  messages: IChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        role: 'user',
        content: action.payload
      });
      state.isLoading = true;
    },
    receiveMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        role: 'assistant',
        content: action.payload
      });
      state.isLoading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    }
  }
});

export const { sendMessage, receiveMessage, setError, clearMessages } = chatSlice.actions;
export default chatSlice.reducer; 