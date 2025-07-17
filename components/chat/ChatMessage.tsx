import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { ChatBubble } from './ChatBubble';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ChatBubble message={message} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
});