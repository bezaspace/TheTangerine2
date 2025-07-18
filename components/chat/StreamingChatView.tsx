import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { ChatMessage } from '@/types/chat';
import { PractitionerResults, AvailabilityResults, BookingResults } from './results';
import { PractitionerCard } from './PractitionerCard';
import { TypingIndicator } from './TypingIndicator';
import Colors from '@/constants/Colors';

interface StreamingChatViewProps {
    messages: ChatMessage[];
    isStreaming: boolean;
    streamingText: string;
    onViewAvailability?: (practitioner: any) => void;
    onSlotSelect?: (practitioner: any, slot: any) => void;
    onNewSearch?: () => void;
}

export const StreamingChatView: React.FC<StreamingChatViewProps> = ({
    messages,
    isStreaming,
    streamingText,
    onViewAvailability,
    onSlotSelect,
    onNewSearch,
}) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const cursorOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Auto-scroll to bottom when new content arrives
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages, streamingText]);

    // Cursor blinking animation
    useEffect(() => {
        if (isStreaming) {
            const blinkAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(cursorOpacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(cursorOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            );
            blinkAnimation.start();
            return () => blinkAnimation.stop();
        } else {
            cursorOpacity.setValue(1);
        }
    }, [isStreaming, cursorOpacity]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderFunctionResult = (message: ChatMessage) => {
        if (!message.functionResults || message.functionResults.length === 0) {
            return null;
        }

        const result = message.functionResults[0];
        const functionName = message.functionCalls?.[0]?.name;

        switch (functionName) {
            case 'search_practitioners':
            case 'search_practitioners_with_recommendations':
                return (
                    <PractitionerResults
                        practitioners={result.practitioners || result.recommendations?.map((r: any) => r.practitioner) || []}
                        searchSummary={result.searchSummary || result.overallSummary}
                        onViewAvailability={onViewAvailability || (() => { })}
                    />
                );

            case 'check_availability':
                return (
                    <AvailabilityResults
                        practitioner={result.practitioner}
                        availableSlots={result.availableSlots || []}
                        message={result.message}
                        onSlotSelect={onSlotSelect || (() => { })}
                    />
                );

            case 'book_appointment':
                return (
                    <BookingResults
                        booking={result.booking}
                        success={result.success}
                        message={result.message}
                        onNewSearch={onNewSearch}
                    />
                );

            default:
                return (
                    <View style={styles.genericResult}>
                        <Text style={styles.genericResultText}>
                            {JSON.stringify(result, null, 2)}
                        </Text>
                    </View>
                );
        }
    };

    const renderPractitionerCard = (message: ChatMessage) => {
        if (!message.practitionerData) {
            return null;
        }

        return (
            <PractitionerCard
                practitioner={message.practitionerData}
                onPress={() => onViewAvailability?.(message.practitionerData)}
                onBookPress={() => onViewAvailability?.(message.practitionerData)}
                showBookButton={true}
            />
        );
    };

    const renderMessage = (message: ChatMessage) => {
        // Handle practitioner card display type (no header for cards)
        if (message.displayType === 'practitioner-card') {
            return (
                <View key={message.id} style={styles.messageContainer}>
                    {renderPractitionerCard(message)}
                </View>
            );
        }

        // Handle explanation text (special styling for explanations)
        if (message.displayType === 'explanation-text') {
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
                    <View style={styles.explanationContainer}>
                        <Text style={[styles.messageText, styles.explanationText]}>
                            {message.content}
                        </Text>
                        {message.isStreaming && (
                            <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
                                |
                            </Animated.Text>
                        )}
                    </View>
                </View>
            );
        }

        // Check if this message has function calling results or is a special display type
        const hasFunctionResults = message.functionCalls && message.functionResults;
        const hasSpecialDisplay = message.displayType && message.displayType !== 'text' && message.displayType !== 'explanation-text';

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
                    {message.content && (
                        <Text style={[styles.messageText, styles.assistantText]}>
                            {message.content}
                        </Text>
                    )}
                    {renderFunctionResult(message)}
                </View>
            );
        }

        // Regular text messages
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
            {messages.map(renderMessage)}

            {/* Streaming response */}
            {isStreaming && (
                <View style={styles.messageContainer}>
                    <View style={styles.messageHeader}>
                        <Text style={[styles.senderName, styles.assistantSender]}>
                            AI Assistant
                        </Text>
                        <Text style={styles.timestamp}>
                            {formatTime(new Date())}
                        </Text>
                    </View>
                    {streamingText ? (
                        <View style={styles.streamingTextContainer}>
                            <Text style={[styles.messageText, styles.assistantText]}>
                                {streamingText}
                            </Text>
                            <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
                                |
                            </Animated.Text>
                        </View>
                    ) : (
                        <TypingIndicator visible={true} />
                    )}
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
    streamingTextContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    cursor: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 24,
        marginLeft: 2,
    },
    genericResult: {
        backgroundColor: Colors.backgroundCard,
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    genericResultText: {
        fontSize: 12,
        color: Colors.textMuted,
        fontFamily: 'monospace',
    },
    explanationContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    explanationText: {
        color: Colors.text,
        fontWeight: '400',
        lineHeight: 26,
    },
});