export interface User {
  id: string;
  email: string;
  password: string;
  subscription: 'free' | 'pro';
  usageToday: number;
  lastUsageDate: string;
  createdAt: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
}

export interface ShiftNote {
  id: string;
  userId: string;
  rawInput: string;
  formattedOutput: string;
  template: string;
  createdAt: string;
  clientName?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface PaymentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface AppData {
  users: User[];
  notes: ShiftNote[];
  templates: Template[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FormatNoteRequest {
  rawInput: string;
  template: string;
  clientName?: string;
}

export interface FormatNoteResponse {
  formattedOutput: string;
  noteId: string;
}
