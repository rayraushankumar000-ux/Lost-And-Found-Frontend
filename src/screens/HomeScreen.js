import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const quickActions = [
    {
      title: 'Report Lost',
      icon: '📝',
      screen: 'Report',
      type: 'lost',
      color: '#ef4444'
    },
    {
      title: 'Report Found', 
      icon: '🔍',
      screen: 'Report',
      type: 'found',
      color: '#10b981'
    },
    {
      title: 'Search Items',
      icon: '🔎',
      screen: 'Search',
      color: '#3b82f6'
    },
    {
      title: 'My Items',
      icon: '📦',
      screen: 'Dashboard',
      color: '#8b5cf6'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Lost & Found</Text>
        <Text style={styles.subtitle}>Reuniting lost items with their owners</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={() => navigation.navigate(action.screen, { type: action.type })}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {/* Activity items would go here */}
      </View>

      {/* Emergency Contact */}
      <TouchableOpacity style={styles.emergencyCard}>
        <Text style={styles.emergencyIcon}>🚨</Text>
        <View style={styles.emergencyContent}>
          <Text style={styles.emergencyTitle}>Emergency Contact</Text>
          <Text style={styles.emergencyText}>
            Found valuable items? Contact authorities directly
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#3b82f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  actionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1e293b',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  activitySection: {
    padding: 20,
  },
  emergencyCard: {
    margin: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1e293b',
  },
  emergencyText: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default HomeScreen;