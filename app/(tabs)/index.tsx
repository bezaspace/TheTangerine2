import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock } from 'lucide-react-native';

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

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>Tangerine</Text>
          <Text style={styles.subtitle}>Find the perfect Ayurvedic practitioner for your wellness journey</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Practitioners</Text>
          
          {practitioners.map((practitioner) => (
            <TouchableOpacity 
              key={practitioner.id} 
              style={styles.practitionerCard}
              onPress={() => router.push(`/book/${practitioner.id}`)}
            >
              <View style={styles.cardContent}>
                <View style={styles.practitionerInfo}>
                  <Text style={styles.practitionerName}>{practitioner.name}</Text>
                  <Text style={styles.specialty}>{practitioner.specialty}</Text>
                  
                  <View style={styles.detailsRow}>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.rating}>{practitioner.rating}</Text>
                    </View>
                    <Text style={styles.experience}>{practitioner.experience}</Text>
                  </View>
                  
                  <View style={styles.locationRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.location}>{practitioner.location}</Text>
                  </View>
                  
                  <View style={styles.availabilityRow}>
                    <Clock size={14} color="#87A96B" />
                    <Text style={styles.nextAvailable}>{practitioner.nextAvailable}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF8C42',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  practitionerInfo: {
    flex: 1,
  },
  practitionerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
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
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextAvailable: {
    fontSize: 14,
    color: '#87A96B',
    fontWeight: '500',
    marginLeft: 4,
  },
});