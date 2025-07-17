import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Practitioner, TimeSlot } from '@/types/practitioner';
import Colors from '@/constants/Colors';

interface BookingInterfaceProps {
  practitioner: Practitioner;
  availableSlots: TimeSlot[];
  onBookingSubmit: (bookingData: {
    practitionerId: string;
    slotId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    consultationType: 'in-person' | 'video' | 'phone';
    symptoms?: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export const BookingInterface: React.FC<BookingInterfaceProps> = ({
  practitioner,
  availableSlots,
  onBookingSubmit,
  onCancel,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [consultationType, setConsultationType] = useState<'in-person' | 'video' | 'phone'>('video');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onBookingSubmit({
      practitionerId: practitioner.id,
      slotId: selectedSlot.id,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      consultationType,
      symptoms: symptoms.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.practitionerName}>with {practitioner.name}</Text>
      </View>

      {/* Time Slot Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotButton,
                selectedSlot?.id === slot.id && styles.selectedSlot,
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[
                styles.slotDate,
                selectedSlot?.id === slot.id && styles.selectedSlotText,
              ]}>
                {slot.date}
              </Text>
              <Text style={[
                styles.slotTime,
                selectedSlot?.id === slot.id && styles.selectedSlotText,
              ]}>
                {slot.startTime}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Consultation Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultation Type</Text>
        <View style={styles.consultationTypes}>
          {(['video', 'phone', 'in-person'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                consultationType === type && styles.selectedType,
              ]}
              onPress={() => setConsultationType(type)}
            >
              <Text style={[
                styles.typeText,
                consultationType === type && styles.selectedTypeText,
              ]}>
                {type === 'in-person' ? 'In-Person' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={patientName}
          onChangeText={setPatientName}
          placeholderTextColor={Colors.textMuted}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          value={patientEmail}
          onChangeText={setPatientEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.textMuted}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={patientPhone}
          onChangeText={setPatientPhone}
          keyboardType="phone-pad"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Symptoms or health concerns (optional)"
          value={symptoms}
          onChangeText={setSymptoms}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholderTextColor={Colors.textMuted}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Additional notes or special requests (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    maxHeight: 500,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  practitionerName: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  slotButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotDate: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  slotTime: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  selectedSlotText: {
    color: Colors.textInverse,
  },
  consultationTypes: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedTypeText: {
    color: Colors.textInverse,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 80,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: Colors.textInverse,
    fontWeight: '600',
  },
});