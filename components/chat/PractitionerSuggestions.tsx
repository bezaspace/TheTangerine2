import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { PractitionerCard } from './PractitionerCard';
import { Practitioner } from '@/types/practitioner';
import Colors from '@/constants/Colors';

interface PractitionerSuggestionsProps {
  practitioners: Practitioner[];
  searchSummary?: string;
  onPractitionerPress?: (practitioner: Practitioner) => void;
  onBookPress?: (practitioner: Practitioner) => void;
}

export const PractitionerSuggestions: React.FC<PractitionerSuggestionsProps> = ({
  practitioners,
  searchSummary,
  onPractitionerPress,
  onBookPress,
}) => {
  if (!practitioners || practitioners.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No practitioners found matching your criteria. Try adjusting your search filters.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {searchSummary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>{searchSummary}</Text>
        </View>
      )}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {practitioners.map((practitioner) => (
          <PractitionerCard
            key={practitioner.id}
            practitioner={practitioner}
            onPress={() => onPractitionerPress?.(practitioner)}
            onBookPress={() => onBookPress?.(practitioner)}
            showBookButton={true}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {practitioners.length} practitioner{practitioners.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
    marginVertical: 8,
  },
  summaryContainer: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingTop: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});