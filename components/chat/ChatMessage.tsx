import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { ChatBubble } from './ChatBubble';
import { FunctionCallMessage } from './FunctionCallMessage';

interface ChatMessageProps {
  message: ChatMessageType;
  onPractitionerPress?: (practitioner: any) => void;
  onBookPress?: (practitioner: any) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onPractitionerPress,
  onBookPress 
}) => {
  // Check if this message has function calling results
  const hasFunctionResults = message.functionCalls && message.functionResults;
  
  if (hasFunctionResults && message.displayType !== 'text') {
    return (
      <View style={styles.container}>
        <FunctionCallMessage
          message={message}
          onPractitionerPress={onPractitionerPress}
          onBookPress={onBookPress}
        />
      </View>
    );
  }

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