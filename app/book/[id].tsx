import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, User, MapPin, ArrowLeft, Star } from 'lucide-react-native';

const practitioners = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'Ayurvedic Medicine',
    rating: 4.9,
    experience: '15 years',
    location: 'Downtown Wellness Center',
    nextAvailable: 'Today 2:00 PM',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    name: 'Dr. Rajesh Patel',
    specialty: 'Panchakarma Therapy',
    rating: 4.8,
    experience: '12 years',
    location: 'Holistic Health Hub',
    nextAvailable: 'Tomorrow 10:00 AM',
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    name: 'Dr. Maya Joshi',
    specialty: 'Herbal Medicine',
    rating: 4.7,
    experience: '18 years',
    location: 'Natural Healing Center',
    nextAvailable: 'Today 4:30 PM',
    image: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const dates = [
  { date: '15', day: 'Today', full: 'March 15, 2024' },
  { date: '16', day: 'Tomorrow', full: 'March 16, 2024' },
  { date: '17', day: 'Sat', full: 'March 17, 2024' },
  { date: '18', day: 'Sun', full: 'March 18, 2024' },
  { date: '19', day: 'Mon', full: 'March 19, 2024' },
];

export default function BookScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const practitioner = practitioners.find(p => p.id === parseInt(id));
    setSelectedPractitioner(practitioner);
  }, [id]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a date and time to book your appointment.');
      return;
    }

    Alert.alert(
      'Appointment Booked!',
      `Your appointment with ${selectedPractitioner.name} on ${selectedDate.full} at ${selectedTime} has been confirmed.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  if (!selectedPractitioner) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Book Appointment</Text>
        </View>

        <View style={styles.practitionerSection}>
          <View style={styles.practitionerCard}>
            <View style={styles.practitionerInfo}>
              <Text style={styles.practitionerName}>{selectedPractitioner.name}</Text>
              <Text style={styles.specialty}>{selectedPractitioner.specialty}</Text>
              
              <View style={styles.detailsRow}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{selectedPractitioner.rating}</Text>
                </View>
                <Text style={styles.experience}>{selectedPractitioner.experience}</Text>
              </View>
              
              <View style={styles.locationRow}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.location}>{selectedPractitioner.location}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#FF8C42" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateOption,
                  selectedDate?.date === date.date && styles.selectedDateOption
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[
                  styles.dateNumber,
                  selectedDate?.date === date.date && styles.selectedDateText
                ]}>
                  {date.date}
                </Text>
                <Text style={[
                  styles.dateDay,
                  selectedDate?.date === date.date && styles.selectedDateText
                ]}>
                  {date.day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#FF8C42" />
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>
          
          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bookingSection}>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  practitionerSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  practitionerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  practitionerInfo: {
    flex: 1,
  },
  practitionerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: '#87A96B',
    fontWeight: '500',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 4,
  },
  experience: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  dateScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dateOption: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedDateOption: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dateDay: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTimeSlot: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  bookingSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  bookButton: {
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});