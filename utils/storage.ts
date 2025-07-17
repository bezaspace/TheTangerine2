import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ChatSession } from '@/types/chat';

const CHAT_SESSIONS_KEY = 'chat_sessions';
const CURRENT_SESSION_KEY = 'current_session';

// Web fallback storage using localStorage
const webStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },

  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  },
};

// Cross-platform storage wrapper
const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      return webStorage.setItem(key, value);
    } else {
      return SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return webStorage.getItem(key);
    } else {
      return SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return webStorage.removeItem(key);
    } else {
      return SecureStore.deleteItemAsync(key);
    }
  },
};

export const StorageUtils = {
  // Chat session storage
  async saveChatSessions(sessions: ChatSession[]): Promise<void> {
    try {
      const data = JSON.stringify(sessions);
      
      // Check data size for SecureStore limitation
      if (Platform.OS !== 'web' && data.length > 2048) {
        console.warn('Chat sessions data is large, consider implementing pagination or cleanup');
        // For now, keep only the last 10 sessions to stay under the limit
        const recentSessions = sessions.slice(-10);
        await storage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(recentSessions));
      } else {
        await storage.setItem(CHAT_SESSIONS_KEY, data);
      }
    } catch (error) {
      console.error('Failed to save chat sessions:', error);
    }
  },

  async getChatSessions(): Promise<ChatSession[]> {
    try {
      const sessions = await storage.getItem(CHAT_SESSIONS_KEY);
      if (sessions) {
        return JSON.parse(sessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get chat sessions:', error);
      return [];
    }
  },

  async saveCurrentSessionId(sessionId: string): Promise<void> {
    try {
      await storage.setItem(CURRENT_SESSION_KEY, sessionId);
    } catch (error) {
      console.error('Failed to save current session ID:', error);
    }
  },

  async getCurrentSessionId(): Promise<string | null> {
    try {
      return await storage.getItem(CURRENT_SESSION_KEY);
    } catch (error) {
      console.error('Failed to get current session ID:', error);
      return null;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await storage.removeItem(CHAT_SESSIONS_KEY);
      await storage.removeItem(CURRENT_SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};