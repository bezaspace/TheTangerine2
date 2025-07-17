import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage } from '@/types/chat';
import { PractitionerSuggestions } from './PractitionerSuggestions';
import { PractitionerRecommendations } from './PractitionerRecommendations';
import Colors from '@/constants/Colors';

interface FunctionCallMessageProps {
  message: ChatMessage;
  onPractitionerPress?: (practitioner: any) => void;
  onBookPress?: (practitioner: any) => void;
}

export const FunctionCallMessage: React.FC<FunctionCallMessageProps> = ({
  message,
  onPractitionerPress,
  onBookPress,
}) => {
  const renderFunctionResult = () => {
    if (!message.functionResults || message.functionResults.length === 0) {
      return null;
    }

    const result = message.functionResults[0];
    const functionName = message.functionCalls?.[0]?.name;

    switch (functionName) {
      case 'search_practitioners':
        return (
          <PractitionerSuggestions
            practitioners={result.practitioners || []}
            searchSummary={result.searchSummary}
            onPractitionerPress={onPractitionerPress}
            onBookPress={onBookPress}
          />
        );

      case 'search_practitioners_with_recommendations':
        return (
          <PractitionerRecommendations
            recommendations={result.recommendations || []}
            overallSummary={result.overallSummary}
            onPractitionerPress={onPractitionerPress}
            onBookPress={onBookPress}
          />
        );

      case 'check_availability':
        return (
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityTitle}>
              Available Slots for {result.practitioner?.name}
            </Text>
            {result.availableSlots && result.availableSlots.length > 0 ? (
              result.availableSlots.map((slot: any, index: number) => (
                <View key={index} style={styles.slotItem}>
                  <Text style={styles.slotDate}>{slot.date}</Text>
                  <Text style={styles.slotTime}>
                    {slot.startTime} - {slot.endTime}
                  </Text>
                  <Text style={styles.slotType}>
                    {slot.consultationType}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noSlotsText}>No available slots found</Text>
            )}
            <Text style={styles.availabilityMessage}>{result.message}</Text>
          </View>
        );

      case 'book_appointment':
        return (
          <View style={styles.bookingContainer}>
            <View style={[
              styles.bookingStatus,
              { backgroundColor: result.success ? Colors.successLight : Colors.errorLight }
            ]}>
              <Text style={[
                styles.bookingStatusText,
                { color: result.success ? Colors.success : Colors.error }
              ]}>
                {result.success ? '✓ Booking Confirmed' : '✗ Booking Failed'}
              </Text>
            </View>
            <Text style={styles.bookingMessage}>{result.message}</Text>
            {result.booking && (
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingDetailText}>
                  Practitioner: {result.booking.practitioner.name}
                </Text>
                <Text style={styles.bookingDetailText}>
                  Date: {result.booking.slot.date}
                </Text>
                <Text style={styles.bookingDetailText}>
                  Time: {result.booking.slot.startTime}
                </Text>
                <Text style={styles.bookingDetailText}>
                  Type: {result.booking.consultationType}
                </Text>
              </View>
            )}
          </View>
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

  return (
    <View style={styles.container}>
      {message.content && (
        <Text style={styles.messageText}>{message.content}</Text>
      )}
      {renderFunctionResult()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  availabilityContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  slotDate: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  slotTime: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  slotType: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noSlotsText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    padding: 16,
  },
  availabilityMessage: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  bookingContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  bookingStatus: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingStatusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookingMessage: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  bookingDetails: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  bookingDetailText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
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
});