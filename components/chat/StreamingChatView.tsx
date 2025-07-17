import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ChatMessage } from '@/types/chat';
import { FunctionCallMessage } from './FunctionCallMessage';
import Colors from '@/constants/Colors';

interface StreamingChatViewProps {
    messages: ChatMessage[];
    isStreaming: boolean;
    streamingText: string;
    onPractitionerPress?: (practitioner: any) => void;
    onBookPress?: (practitioner: any) => void;
}

export const StreamingChatView: React.FC<StreamingChatViewProps> = ({
    messages,
    isStreaming,
    streamingText,
    onPractitionerPress,
    onBookPress,
}) => {
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        // Auto-scroll to bottom when new content arrives
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages, streamingText]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = (message: ChatMessage) => {
        // Check if this message has function calling results or is a special display type
        const hasFunctionResults = message.functionCalls && message.functionResults;
        const hasSpecialDisplay = message.displayType && message.displayType !== 'text';

        if ((hasFunctionResults || hasSpecialDisplay) && message.displayType !== 'text') {
            return (
                <View key={message.id} style={styles.messageContainer}>
                    <View style={styles.messageHeader}>
                        <Text style={[styles.senderName, styles.assistantSender]}>
                            AI Assistant
                        </Text>
                        <Text style={styles.timestamp}>
                            {formatTime(message.timestamp)}
                        </Text>
                    </View>
                    <FunctionCallMessage
                        message={message}
                        onPractitionerPress={onPractitionerPress}
                        onBookPress={onBookPress}
                    />
                </View>
            );
        }

        return (
            <View key={message.id} style={styles.messageContainer}>
                <View style={styles.messageHeader}>
                    <Text style={[
                        styles.senderName,
                        message.role === 'user' ? styles.userSender : styles.assistantSender
                    ]}>
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </Text>
                    <Text style={styles.timestamp}>
                        {formatTime(message.timestamp)}
                    </Text>
                </View>
                <Text style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userText : styles.assistantText
                ]}>
                    {message.content}
                </Text>
            </View>
        );
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {messages
                .filter(message => !message.isStreaming) // Don't show messages that are currently streaming
                .map(renderMessage)}

            {/* Streaming response */}
            {isStreaming && (
                <View style={styles.messageContainer}>
                    <View style={styles.messageHeader}>
                        <Text style={[styles.senderName, styles.assistantSender]}>
                            AI Assistant
                        </Text>
                        <View style={styles.typingIndicator}>
                            <Text style={styles.typingText}>typing...</Text>
                        </View>
                    </View>
                    <Text style={[styles.messageText, styles.assistantText]}>
                        {streamingText}
                        <Text style={styles.cursor}>|</Text>
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    messageContainer: {
        marginBottom: 24,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    senderName: {
        fontSize: 14,
        fontWeight: '600',
    },
    userSender: {
        color: Colors.primary,
    },
    assistantSender: {
        color: Colors.primary,
    },
    timestamp: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
    },
    userText: {
        color: Colors.text,
    },
    assistantText: {
        color: Colors.text,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
    cursor: {
        color: Colors.primary,
        fontWeight: 'bold',
        opacity: 0.8,
    },
});