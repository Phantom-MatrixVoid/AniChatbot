
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
