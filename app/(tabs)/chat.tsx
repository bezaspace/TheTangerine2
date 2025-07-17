import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { useChat } from '@/hooks/useChat';
import { ChatMessage as ChatMessageType } from '@/types/chat';

export default function ChatScreen() {
  const {
    currentSession,
    isLoading,
    error,
    sendMessage,
    clearError,
    refresh,
  } = useChat();

  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (currentSession?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSession?.messages.length]);

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
    await sendMessage(message, false); // Set to true for streaming
  };

  const renderMessage = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage message={item} />
  );

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
      
      <FlatList
        ref={flatListRef}
        data={currentSession.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContainer,
          currentSession.messages.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor="#FF8C42"
            colors={['#FF8C42']}
          />
        }
      />

      <TypingIndicator visible={isLoading} />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8C42',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyHint: {
    fontSize: 14,
    color: '#87A96B',
    textAlign: 'left',
    lineHeight: 20,
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#87A96B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});