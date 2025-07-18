export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  // Function calling properties
  functionCalls?: Array<{
    name: string;
    args: Record<string, any>;
  }>;
  functionResults?: any[];
  displayType?: 'text' | 'practitioner-suggestions' | 'practitioner-recommendations' | 'booking-confirmation' | 'availability-check';
  // Interaction context for multi-step flows
  interactionContext?: {
    selectedPractitioner?: any;
    selectedSlot?: any;
    bookingStep?: 'search' | 'availability' | 'booking' | 'confirmation';
  };
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
}

export interface SendMessageOptions {
  content: string;
  streaming?: boolean;
  enableFunctionCalling?: boolean;
}