export interface GeminiConfig {
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiResponse {
  text: string;
  finishReason?: string;
}

export interface GeminiStreamChunk {
  text: string;
  done: boolean;
}

export interface GeminiError {
  message: string;
  code?: string;
  status?: number;
}

// Enhanced response type for function calling
export interface GeminiFunctionResponse extends GeminiResponse {
  functionCalls?: Array<{
    name: string;
    args: Record<string, any>;
  }>;
  functionResults?: any[];
}