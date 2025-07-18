import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Practitioner } from '@/types/practitioner';
import { PractitionerCard } from '../PractitionerCard';
import Colors from '@/constants/Colors';

interface PractitionerResultsProps {
  practitioners: Practitioner[];
  searchSummary?: string;
  onViewAvailability: (practitioner: Practitioner) => void;
  onBookDirect?: (practitioner: Practitioner) => void;
}

export const PractitionerResults: React.FC<PractitionerResultsProps> = ({
  practitioners,
  searchSummary,
  onViewAvailability,
  onBookDirect,
}) => {
  return (
    <View style={styles.container}>
      {searchSummary && (
        <Text style={styles.summaryText}>{searchSummary}</Text>
      )}
      
      <View style={styles.practitionerList}>
        {practitioners.map((practitioner) => (
          <PractitionerCard
            key={practitioner.id}
            practitioner={practitioner}
            onPress={() => onViewAvailability(practitioner)}
            onBookPress={() => onViewAvailability(practitioner)}
            showBookButton={true}
          />
        ))}
      </View>
      
      {practitioners.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No practitioners found matching your criteria.
          </Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search filters or location.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  summaryText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '500',
  },
  practitionerList: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});