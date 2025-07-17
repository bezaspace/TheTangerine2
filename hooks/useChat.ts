import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatSession, ChatState } from '@/types/chat';
import { chatService } from '@/services/chatService';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    currentSession: null,
    sessions: [],
    isLoading: false,
    error: null,
  });

  // Initialize chat on mount
  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const sessions = await chatService.loadSessions();
      let currentSession = await chatService.getCurrentSession();
      
      // Create new session if none exists
      if (!currentSession) {
        currentSession = await chatService.createNewSession();
        await chatService.saveSession(currentSession);
      }

      setState(prev => ({
        ...prev,
        sessions,
        currentSession,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };

  const sendMessage = useCallback(async (content: string, streaming: boolean = false) => {
    if (!state.currentSession || !content.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = { ...state.currentSession };
      await chatService.sendMessage(updatedSession, content.trim(), streaming);
      await chatService.saveSession(updatedSession);

      setState(prev => ({
        ...prev,
        currentSession: updatedSession,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }, [state.currentSession]);

  const createNewSession = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const newSession = await chatService.createNewSession();
      await chatService.saveSession(newSession);
      
      const sessions = await chatService.loadSessions();

      setState(prev => ({
        ...prev,
        currentSession: newSession,
        sessions,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }, []);

  const switchToSession = useCallback(async (sessionId: string) => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (session) {
      setState(prev => ({ ...prev, currentSession: session }));
      await chatService.saveSession(session);
    }
  }, [state.sessions]);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await chatService.deleteSession(sessionId);
      const sessions = await chatService.loadSessions();
      
      let currentSession = state.currentSession;
      if (currentSession?.id === sessionId) {
        currentSession = sessions.length > 0 ? sessions[0] : await chatService.createNewSession();
        if (sessions.length === 0) {
          await chatService.saveSession(currentSession);
        }
      }

      setState(prev => ({
        ...prev,
        sessions,
        currentSession,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    }
  }, [state.currentSession]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    sendMessage,
    createNewSession,
    switchToSession,
    deleteSession,
    clearError,
    refresh: initializeChat,
  };
};