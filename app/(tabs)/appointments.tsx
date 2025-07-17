import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, Phone, MessageCircle } from 'lucide-react-native';

const appointments = [
  {
    id: 1,
    practitioner: 'Dr. Priya Sharma',
    specialty: 'Ayurvedic Medicine',
    date: 'March 15, 2024',
    time: '2:00 PM',
    location: 'Downtown Wellness Center',
    status: 'upcoming',
    phone: '+1 (555) 123-4567',
  },
  {
    id: 2,
    practitioner: 'Dr. Rajesh Patel',
    specialty: 'Panchakarma Therapy',
    date: 'March 18, 2024',
    time: '10:00 AM',
    location: 'Holistic Health Hub',
    status: 'upcoming',
    phone: '+1 (555) 987-6543',
  },
  {
    id: 3,
    practitioner: 'Dr. Maya Joshi',
    specialty: 'Herbal Medicine',
    date: 'March 12, 2024',
    time: '4:30 PM',
    location: 'Natural Healing Center',
    status: 'completed',
    phone: '+1 (555) 456-7890',
  },
];

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredAppointments = appointments.filter(appointment => 
    activeTab === 'upcoming' ? appointment.status === 'upcoming' : appointment.status === 'completed'
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <Text style={styles.subtitle}>Manage your scheduled sessions</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.appointmentsList}>
          {filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.practitionerName}>{appointment.practitioner}</Text>
                <View style={[
                  styles.statusBadge,
                  appointment.status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    appointment.status === 'upcoming' ? styles.upcomingText : styles.completedText
                  ]}>
                    {appointment.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.specialty}>{appointment.specialty}</Text>
              
              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{appointment.date}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{appointment.location}</Text>
                </View>
              </View>
              
              {appointment.status === 'upcoming' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <Phone size={16} color="#FF8C42" />
                    <Text style={styles.secondaryButtonText}>Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.secondaryButton}>
                    <MessageCircle size={16} color="#FF8C42" />
                    <Text style={styles.secondaryButtonText}>Message</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {appointment.status === 'completed' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Book Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          
          {filteredAppointments.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No {activeTab} appointments
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {activeTab === 'upcoming' 
                  ? 'Book your first appointment to get started' 
                  : 'Your completed appointments will appear here'}
              </Text>
            </View>
          )}
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
  header: {
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  appointmentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  practitionerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: '#FFF7F0',
  },
  completedBadge: {
    backgroundColor: '#F0F9FF',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  upcomingText: {
    color: '#FF8C42',
  },
  completedText: {
    color: '#3B82F6',
  },
  specialty: {
    fontSize: 14,
    color: '#87A96B',
    fontWeight: '500',
    marginBottom: 12,
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FF8C42',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8C42',
    minWidth: 80,
  },
  secondaryButtonText: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});