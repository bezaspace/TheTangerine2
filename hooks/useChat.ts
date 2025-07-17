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
      // Always create a fresh session on app start (no persistence)
      const currentSession = await chatService.createNewSession();

      setState(prev => ({
        ...prev,
        sessions: [currentSession],
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

  const sendMessage = useCallback(async (
    content: string, 
    options: { streaming?: boolean; enableFunctionCalling?: boolean } = {}
  ) => {
    if (!state.currentSession || !content.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = { ...state.currentSession };
      
      if (options.streaming) {
        // Use streaming with real-time updates
        await chatService.sendMessageWithStreaming(
          updatedSession, 
          content.trim(),
          (chunk: string, fullText: string) => {
            // Update state with streaming content
            setState(prev => ({
              ...prev,
              currentSession: updatedSession,
            }));
          },
          { enableFunctionCalling: options.enableFunctionCalling }
        );
      } else {
        // Use regular message sending
        await chatService.sendMessage(updatedSession, content.trim(), options);
      }

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

  const sendMessageWithStreaming = useCallback(async (
    content: string,
    onStreamUpdate: (chunk: string, fullText: string) => void,
    options: { enableFunctionCalling?: boolean } = {}
  ) => {
    if (!state.currentSession || !content.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = { ...state.currentSession };
      
      await chatService.sendMessageWithStreaming(
        updatedSession, 
        content.trim(),
        (chunk: string, fullText: string) => {
          // Update state with streaming content
          setState(prev => ({
            ...prev,
            currentSession: updatedSession,
          }));
          // Call the provided callback
          onStreamUpdate(chunk, fullText);
        },
        options
      );

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
      // Remove persistent saving - keep only in memory
      
      setState(prev => ({
        ...prev,
        currentSession: newSession,
        sessions: [newSession], // Reset to just the new session
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
      // Remove persistent saving - keep only in memory
    }
  }, [state.sessions]);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      const sessions = state.sessions.filter(s => s.id !== sessionId);
      
      let currentSession = state.currentSession;
      if (currentSession?.id === sessionId) {
        currentSession = sessions.length > 0 ? sessions[0] : await chatService.createNewSession();
        if (sessions.length === 0) {
          sessions.push(currentSession);
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
  }, [state.currentSession, state.sessions]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    sendMessage,
    sendMessageWithStreaming,
    createNewSession,
    switchToSession,
    deleteSession,
    clearError,
    refresh: initializeChat,
  };
};