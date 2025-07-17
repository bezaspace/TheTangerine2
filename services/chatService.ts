import uuid from 'react-native-uuid';
import { ChatMessage, ChatSession } from '@/types/chat';
import { StorageUtils } from '@/utils/storage';
import { geminiService } from './geminiService';

class ChatService {
  async createNewSession(): Promise<ChatSession> {
    const session: ChatSession = {
      id: uuid.v4() as string,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return session;
  }

  async addMessage(
    session: ChatSession,
    content: string,
    role: 'user' | 'assistant'
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: uuid.v4() as string,
      content,
      role,
      timestamp: new Date(),
    };

    session.messages.push(message);
    session.updatedAt = new Date();

    return message;
  }

  // Initialize chat with Gemini's native chat functionality
  initializeGeminiChat(session: ChatSession): void {
    // Convert session messages to Gemini chat history format
    const history = session.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }]
    }));

    geminiService.initializeChat(history);
  }

  // Send message with streaming using Gemini's native chat
  async sendMessageWithStreaming(
    session: ChatSession,
    userMessage: string,
    onStreamChunk: (chunk: string, fullText: string) => void,
    options: { enableFunctionCalling?: boolean } = {}
  ): Promise<ChatMessage> {
    const { enableFunctionCalling = true } = options;
    
    // Add user message
    await this.addMessage(session, userMessage, 'user');

    // Initialize or update Gemini chat with current session
    this.initializeGeminiChat(session);

    // Create assistant message placeholder
    const assistantMessage = await this.addMessage(session, '', 'assistant');
    assistantMessage.isStreaming = true;

    try {
      if (enableFunctionCalling && this.shouldUseFunctionCalling(userMessage)) {
        // Use function calling for practitioner-related queries (non-streaming for now)
        const response = await geminiService.generateResponseWithFunctionCalling(userMessage);
        
        assistantMessage.content = response.text;
        assistantMessage.functionCalls = response.functionCalls;
        assistantMessage.functionResults = response.functionResults;
        
        // Determine display type based on function calls
        if (response.functionCalls && response.functionCalls.length > 0) {
          const functionName = response.functionCalls[0].name;
          switch (functionName) {
            case 'search_practitioners_with_recommendations':
              assistantMessage.displayType = 'practitioner-recommendations';
              break;
            case 'check_availability':
              assistantMessage.displayType = 'availability-check';
              break;
            case 'book_appointment':
              assistantMessage.displayType = 'booking-confirmation';
              break;
            default:
              assistantMessage.displayType = 'text';
          }
        }
        
        // Call onStreamChunk with final result for function calling
        onStreamChunk(response.text, response.text);
      } else {
        // Use streaming for regular chat responses
        let fullResponse = '';
        const streamGenerator = geminiService.sendMessageStream(userMessage);
        
        for await (const chunk of streamGenerator) {
          fullResponse += chunk; // Accumulate incremental chunks
          // Don't update assistantMessage.content during streaming - only update streaming display
          onStreamChunk(chunk, fullResponse);
        }
        
        // Only update the message content when streaming is complete
        assistantMessage.content = fullResponse;
        assistantMessage.displayType = 'text';
      }
      
      assistantMessage.isStreaming = false;
    } catch (error: any) {
      const errorMessage = `I apologize, but I encountered an error: ${error.message}. Please try again.`;
      assistantMessage.content = errorMessage;
      assistantMessage.isStreaming = false;
      assistantMessage.displayType = 'text';
      onStreamChunk(errorMessage, errorMessage);
    }

    return assistantMessage;
  }

  // Legacy method for backward compatibility
  async sendMessage(
    session: ChatSession,
    userMessage: string,
    options: { streaming?: boolean; enableFunctionCalling?: boolean } = {}
  ): Promise<ChatMessage> {
    const { streaming = false, enableFunctionCalling = true } = options;
    
    if (streaming) {
      // Use the new streaming method with a simple callback
      return this.sendMessageWithStreaming(session, userMessage, () => {}, { enableFunctionCalling });
    }

    // Add user message
    await this.addMessage(session, userMessage, 'user');

    // Initialize Gemini chat
    this.initializeGeminiChat(session);

    // Create assistant message placeholder
    const assistantMessage = await this.addMessage(session, '', 'assistant');

    try {
      if (enableFunctionCalling && this.shouldUseFunctionCalling(userMessage)) {
        // Use function calling for practitioner-related queries
        const response = await geminiService.generateResponseWithFunctionCalling(userMessage);
        
        assistantMessage.content = response.text;
        assistantMessage.functionCalls = response.functionCalls;
        assistantMessage.functionResults = response.functionResults;
        
        // Determine display type based on function calls
        if (response.functionCalls && response.functionCalls.length > 0) {
          const functionName = response.functionCalls[0].name;
          switch (functionName) {
            case 'search_practitioners_with_recommendations':
              assistantMessage.displayType = 'practitioner-recommendations';
              break;
            case 'check_availability':
              assistantMessage.displayType = 'availability-check';
              break;
            case 'book_appointment':
              assistantMessage.displayType = 'booking-confirmation';
              break;
            default:
              assistantMessage.displayType = 'text';
          }
        }
      } else {
        // Use regular chat response
        const response = await geminiService.sendMessage(userMessage);
        assistantMessage.content = response.text;
        assistantMessage.displayType = 'text';
      }
    } catch (error: any) {
      assistantMessage.content = `I apologize, but I encountered an error: ${error.message}. Please try again.`;
      assistantMessage.displayType = 'text';
    }

    return assistantMessage;
  }

  private shouldUseFunctionCalling(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that suggest practitioner search or booking
    const practitionerKeywords = [
      'find', 'search', 'doctor', 'practitioner', 'physician',
      'book', 'appointment', 'schedule', 'consultation',
      'available', 'availability', 'time', 'slot',
      'specialist', 'expert', 'ayurvedic doctor',
      'panchakarma', 'treatment', 'therapy',
      'near me', 'location', 'city'
    ];

    // Health condition keywords that suggest need for practitioner search
    const healthKeywords = [
      'digestive', 'digestion', 'stomach', 'acidity', 'bloating',
      'stress', 'anxiety', 'depression', 'insomnia', 'sleep',
      'joint', 'arthritis', 'pain', 'headache', 'migraine',
      'skin', 'eczema', 'psoriasis', 'acne', 'rash',
      'weight', 'obesity', 'diabetes', 'blood pressure',
      'respiratory', 'asthma', 'cough', 'cold', 'fever',
      'women', 'fertility', 'menstrual', 'pregnancy', 'hormonal',
      'immunity', 'detox', 'cleanse', 'rejuvenation'
    ];

    // Check for direct practitioner-related keywords
    const hasPractitionerKeywords = practitionerKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Check for health conditions that might need practitioner consultation
    const hasHealthKeywords = healthKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Also check for phrases that suggest looking for help
    const helpPhrases = [
      'help with', 'help me', 'need help', 'looking for',
      'suffering from', 'dealing with', 'problem with',
      'issue with', 'trouble with', 'concern about'
    ];
    
    const hasHelpPhrases = helpPhrases.some(phrase => lowerMessage.includes(phrase));
    
    return hasPractitionerKeywords || (hasHealthKeywords && hasHelpPhrases) || hasHealthKeywords;
  }

  async saveSession(session: ChatSession): Promise<void> {
    try {
      const sessions = await StorageUtils.getChatSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }

      await StorageUtils.saveChatSessions(sessions);
      await StorageUtils.saveCurrentSessionId(session.id);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  async loadSessions(): Promise<ChatSession[]> {
    return await StorageUtils.getChatSessions();
  }

  async getCurrentSession(): Promise<ChatSession | null> {
    try {
      const currentSessionId = await StorageUtils.getCurrentSessionId();
      if (!currentSessionId) return null;

      const sessions = await StorageUtils.getChatSessions();
      return sessions.find(s => s.id === currentSessionId) || null;
    } catch (error) {
      console.error('Failed to get current session:', error);
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const sessions = await StorageUtils.getChatSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      await StorageUtils.saveChatSessions(filteredSessions);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  async clearAllSessions(): Promise<void> {
    await StorageUtils.clearAllData();
  }
}

export const chatService = new ChatService();