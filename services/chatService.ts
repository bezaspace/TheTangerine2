import uuid from 'react-native-uuid';
import { ChatMessage, ChatSession } from '@/types/chat';
import { StorageUtils } from '@/utils/storage';
import { geminiService } from './geminiService';
import { StreamingParser } from '@/utils/streamingParser';
import { practitionerService } from './practitionerService';

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

    try {
      if (enableFunctionCalling && this.shouldUsePractitionerStreaming(userMessage)) {
        // Use streaming practitioner recommendations
        return await this.handleStreamingPractitionerRecommendations(
          session, 
          userMessage, 
          onStreamChunk
        );
      } else if (enableFunctionCalling && this.shouldUseFunctionCalling(userMessage)) {
        // Use function calling for non-practitioner queries (availability, booking)
        const assistantMessage = await this.addMessage(session, '', 'assistant');
        assistantMessage.isStreaming = true;

        const response = await geminiService.generateResponseWithFunctionCalling(userMessage);
        
        assistantMessage.content = response.text;
        assistantMessage.functionCalls = response.functionCalls;
        assistantMessage.functionResults = response.functionResults;
        
        // Determine display type based on function calls
        if (response.functionCalls && response.functionCalls.length > 0) {
          const functionName = response.functionCalls[0].name;
          switch (functionName) {
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
        
        assistantMessage.isStreaming = false;
        onStreamChunk(response.text, response.text);
        return assistantMessage;
      } else {
        // Use streaming for regular chat responses
        const assistantMessage = await this.addMessage(session, '', 'assistant');
        assistantMessage.isStreaming = true;

        let finalResponse = '';
        const streamGenerator = geminiService.sendMessageStream(userMessage);
        
        for await (const fullText of streamGenerator) {
          finalResponse = fullText;
          onStreamChunk('', fullText);
        }
        
        assistantMessage.content = finalResponse;
        assistantMessage.displayType = 'text';
        assistantMessage.isStreaming = false;
        return assistantMessage;
      }
    } catch (error: any) {
      const assistantMessage = await this.addMessage(session, '', 'assistant');
      const errorMessage = `I apologize, but I encountered an error: ${error.message}. Please try again.`;
      assistantMessage.content = errorMessage;
      assistantMessage.isStreaming = false;
      assistantMessage.displayType = 'text';
      onStreamChunk(errorMessage, errorMessage);
      return assistantMessage;
    }
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

  private shouldUsePractitionerStreaming(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that specifically suggest practitioner search (not availability/booking)
    const practitionerSearchKeywords = [
      'find', 'search', 'doctor', 'practitioner', 'physician',
      'specialist', 'expert', 'ayurvedic doctor',
      'recommend', 'suggestion', 'help me find',
      'looking for doctor', 'need a doctor'
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

    // Exclude availability and booking keywords (these should use function calling)
    const excludeKeywords = [
      'available', 'availability', 'time', 'slot', 'schedule',
      'book', 'appointment', 'booking', 'confirm'
    ];

    const hasPractitionerKeywords = practitionerSearchKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasHealthKeywords = healthKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasExcludeKeywords = excludeKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Use streaming for practitioner search, but not for availability/booking
    return (hasPractitionerKeywords || hasHealthKeywords) && !hasExcludeKeywords;
  }

  private shouldUseFunctionCalling(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that suggest availability checking or booking (use function calling)
    const functionCallingKeywords = [
      'available', 'availability', 'time', 'slot',
      'book', 'appointment', 'schedule', 'consultation',
      'confirm', 'booking'
    ];

    return functionCallingKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private async handleStreamingPractitionerRecommendations(
    session: ChatSession,
    userMessage: string,
    onStreamChunk: (chunk: string, fullText: string) => void
  ): Promise<ChatMessage> {
    // Parse query parameters from user message
    const args = this.parseUserQuery(userMessage);
    
    try {
      // Get structured recommendations from Gemini
      const result = await geminiService.generateAlternatingPractitionerRecommendations(args);
      
      if (!result.structuredData?.recommendations || result.structuredData.recommendations.length === 0) {
        const errorMessage = result.overallSummary || "I couldn't find any practitioners matching your criteria.";
        const assistantMessage = await this.addMessage(session, errorMessage, 'assistant');
        assistantMessage.displayType = 'text';
        onStreamChunk(errorMessage, errorMessage);
        return assistantMessage;
      }

      // Process structured recommendations with streaming
      return await this.processStructuredRecommendationsWithStreaming(
        session,
        result.structuredData,
        result.practitioners,
        onStreamChunk
      );
      
    } catch (error: any) {
      const errorMessage = `I apologize, but I encountered an error while searching for practitioners: ${error.message}. Please try again.`;
      const assistantMessage = await this.addMessage(session, errorMessage, 'assistant');
      assistantMessage.displayType = 'text';
      onStreamChunk(errorMessage, errorMessage);
      return assistantMessage;
    }
  }

  private async processStructuredRecommendationsWithStreaming(
    session: ChatSession,
    structuredData: any,
    practitioners: any[],
    onStreamChunk: (chunk: string, fullText: string) => void
  ): Promise<ChatMessage> {
    const { StreamingParser } = await import('@/utils/streamingParser');
    
    // Create sequential chunks from structured data
    const chunks = StreamingParser.createSequentialChunks(structuredData, practitioners);
    
    let lastMessage: ChatMessage | null = null;
    
    // Process each chunk with streaming effect
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      if (chunk.type === 'explanation') {
        // Create explanation message with streaming effect
        const explanationMessage = await this.addMessage(session, '', 'assistant');
        explanationMessage.displayType = 'explanation-text';
        explanationMessage.isStreaming = true;
        explanationMessage.sequenceInfo = {
          type: 'explanation',
          index: i,
          totalCount: chunks.length
        };
        
        // Stream the explanation text word by word
        const streamGenerator = StreamingParser.streamText(chunk.content, 80);
        for await (const partialText of streamGenerator) {
          explanationMessage.content = partialText;
          onStreamChunk('', partialText);
          
          // Small delay for realistic typing effect
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        explanationMessage.isStreaming = false;
        lastMessage = explanationMessage;
        
        // Pause before showing practitioner card
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } else if (chunk.type === 'practitioner-card' && chunk.practitioner) {
        // Create practitioner card message
        const cardMessage = await this.addMessage(session, '', 'assistant');
        cardMessage.displayType = 'practitioner-card';
        cardMessage.practitionerData = chunk.practitioner;
        cardMessage.sequenceInfo = {
          type: 'practitioner-card',
          index: i,
          totalCount: chunks.length,
          practitionerId: chunk.practitioner.id
        };
        
        // Notify about the new card
        onStreamChunk('', '');
        lastMessage = cardMessage;
        
        // Pause before next explanation (if not last item)
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    // Add summary message if available
    if (structuredData.overallSummary) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const summaryMessage = await this.addMessage(session, '', 'assistant');
      summaryMessage.displayType = 'text';
      summaryMessage.isStreaming = true;
      
      // Stream the summary
      const streamGenerator = StreamingParser.streamText(structuredData.overallSummary, 60);
      for await (const partialText of streamGenerator) {
        summaryMessage.content = partialText;
        onStreamChunk('', partialText);
        await new Promise(resolve => setTimeout(resolve, 40));
      }
      
      summaryMessage.isStreaming = false;
      lastMessage = summaryMessage;
    }
    
    return lastMessage || await this.addMessage(session, 'Recommendations complete.', 'assistant');
  }

  private parseUserQuery(userMessage: string): any {
    const lowerMessage = userMessage.toLowerCase();
    const args: any = { query: userMessage, limit: 3 };
    
    // Extract location
    const locationMatch = lowerMessage.match(/in\s+([a-zA-Z\s]+?)(?:\s|$|,)/);
    if (locationMatch) {
      args.location = locationMatch[1].trim();
    }
    
    // Extract specialization
    const specializationKeywords = {
      'digestive': 'Digestive Disorders',
      'panchakarma': 'Panchakarma',
      'women': 'Women\'s Health',
      'stress': 'Stress Management',
      'skin': 'Skin Disorders',
      'joint': 'Joint & Bone Health',
      'respiratory': 'Respiratory Health'
    };
    
    for (const [keyword, specialization] of Object.entries(specializationKeywords)) {
      if (lowerMessage.includes(keyword)) {
        args.specialization = specialization;
        break;
      }
    }
    
    return args;
  }

  private async findPractitionerById(practitionerId: string): Promise<any> {
    try {
      return await practitionerService.getPractitionerById(practitionerId);
    } catch (error) {
      console.error('Error finding practitioner:', error);
      return null;
    }
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