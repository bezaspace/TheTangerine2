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

  async sendMessage(
    session: ChatSession,
    userMessage: string,
    streaming: boolean = false
  ): Promise<ChatMessage> {
    // Add user message
    await this.addMessage(session, userMessage, 'user');

    // Create assistant message placeholder
    const assistantMessage = await this.addMessage(session, '', 'assistant');
    assistantMessage.isStreaming = streaming;

    try {
      if (streaming) {
        // Handle streaming response
        let fullResponse = '';
        const streamGenerator = geminiService.generateStreamResponse(userMessage);
        
        for await (const chunk of streamGenerator) {
          fullResponse += chunk;
          assistantMessage.content = fullResponse;
          // Note: In a real implementation, you'd want to emit updates here
          // for real-time UI updates
        }
        
        assistantMessage.isStreaming = false;
      } else {
        // Handle regular response
        const response = await geminiService.generateResponse(userMessage);
        assistantMessage.content = response.text;
      }
    } catch (error: any) {
      assistantMessage.content = `I apologize, but I encountered an error: ${error.message}. Please try again.`;
      assistantMessage.isStreaming = false;
    }

    return assistantMessage;
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