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
  displayType?: 'text' | 'structured-practitioner-recommendations' | 'booking-confirmation' | 'availability-check' | 'explanation-text' | 'practitioner-card';
  // Structured recommendation data
  structuredData?: StructuredPractitionerRecommendation;
  // Practitioner data for card display
  practitionerData?: any;
  // Sequence information for alternating display
  sequenceInfo?: {
    type: 'explanation' | 'practitioner-card';
    index: number;
    totalCount: number;
    practitionerId?: string;
  };
  // Interaction context for multi-step flows
  interactionContext?: {
    selectedPractitioner?: any;
    selectedSlot?: any;
    bookingStep?: 'search' | 'availability' | 'booking' | 'confirmation';
  };
}

export interface StructuredPractitionerRecommendation {
  type: 'explanation' | 'practitioner-card';
  explanation?: string;
  practitioner?: any;
  recommendationReason?: string;
  keyBenefits?: string[];
  matchScore?: number;
}

export interface StreamingRecommendationChunk {
  type: 'explanation' | 'practitioner-card' | 'summary';
  content: string;
  practitionerId?: string;
  practitioner?: any;
  isComplete: boolean;
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