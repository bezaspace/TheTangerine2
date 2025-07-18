import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { StreamingChatView } from '@/components/chat/StreamingChatView';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import Colors from '@/constants/Colors';

export default function ChatScreen() {
  const {
    currentSession,
    isLoading,
    error,
    sendMessageWithStreaming,
    selectPractitioner,
    selectSlot,
    clearError,
    refresh,
  } = useChat();

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Error',
        error,
        [
          {
            text: 'OK',
            onPress: clearError,
          },
        ]
      );
    }
  }, [error, clearError]);

  const handleSendMessage = async (message: string) => {
    setIsStreaming(true);
    setStreamingText('');
    
    try {
      await sendMessageWithStreaming(
        message,
        (chunk: string, fullText: string) => {
          console.log('Streaming chunk:', chunk.length, 'chars, Full text:', fullText.length, 'chars');
          
          // Clear any existing timeout
          if (streamingTimeoutRef.current) {
            clearTimeout(streamingTimeoutRef.current);
          }
          
          // Update immediately for smooth streaming
          setStreamingText(fullText);
        },
        { enableFunctionCalling: true }
      );
    } finally {
      // Use React.startTransition to ensure smooth state updates
      React.startTransition(() => {
        setIsStreaming(false);
        setStreamingText('');
      });
    }
  };

  const handleViewAvailability = async (practitioner: any) => {
    console.log('Viewing availability for:', practitioner.name);
    await selectPractitioner(practitioner);
  };

  const handleSlotSelect = async (practitioner: any, slot: any) => {
    console.log('Slot selected:', slot, 'for practitioner:', practitioner.name);
    await selectSlot(practitioner, slot);
  };

  const handleNewSearch = () => {
    handleSendMessage('Find me more practitioners');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Welcome to Tangerine AI</Text>
      <Text style={styles.emptySubtitle}>
        I'm here to help you with Ayurvedic wellness, answer questions about our app, 
        and guide you on your holistic health journey.
      </Text>
      <Text style={styles.emptyHint}>
        Try asking me about:
        {'\n'}• Ayurvedic principles and practices
        {'\n'}• Wellness tips and guidance
        {'\n'}• How to use the Tangerine app
        {'\n'}• Finding the right practitioner for you
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>AI Assistant</Text>
      <Text style={styles.headerSubtitle}>
        Your personal Ayurvedic wellness guide
      </Text>
    </View>
  );

  if (!currentSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {currentSession.messages.length === 0 ? (
        <View style={[styles.messagesList, styles.emptyContainer]}>
          {renderEmptyState()}
        </View>
      ) : (
        <StreamingChatView
          messages={currentSession.messages}
          isStreaming={isStreaming}
          streamingText={streamingText}
          onViewAvailability={handleViewAvailability}
          onSlotSelect={handleSlotSelect}
          onNewSearch={handleNewSearch}
        />
      )}
      
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || isStreaming}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'left',
    lineHeight: 20,
    backgroundColor: Colors.backgroundCard,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});