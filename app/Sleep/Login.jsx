import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Login() {
  const router = useRouter();

  // State Management
  const [name, setName] = useState('');
  const [sleepTime, setSleepTime] = useState(new Date(2024, 0, 1, 22, 30, 0));
  const [wakeTime, setWakeTime] = useState(new Date(2024, 0, 2, 8, 0, 0));
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingUser();
    requestNotificationPermissions();
  }, []);

  // REQUEST NOTIFICATION PERMISSIONS
  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in settings for sleep reminders to work'
        );
      }
    } catch (error) {
      console.log('Permission error:', error);
    }
  };

  // CHECK IF USER ALREADY EXISTS
  const checkExistingUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        router.replace('/(Screens)/HomeScreen');
      }
    } catch (error) {
      console.log('Error checking user:', error);
    }
  };

  // CALCULATE SLEEP DURATION
  const calculateSleepDuration = (sleep, wake) => {
    let diff = wake.getTime() - sleep.getTime();
    if (diff < 0) diff += 24 * 60 * 60 * 1000;
    return diff / (1000 * 60 * 60);
  };

  const sleepDuration = calculateSleepDuration(sleepTime, wakeTime);

  // VALIDATE AND SAVE USER DATA
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('❌ Error', 'Please enter your name');
      return;
    }

    if (sleepDuration < 8) {
      Alert.alert(
        '⚠️ Warning',
        `Sleep duration must be at least 8 hours. You have ${sleepDuration.toFixed(1)} hours`
      );
      return;
    }

    if (sleepDuration > 12) {
      Alert.alert(
        '⚠️ Warning',
        `Sleep duration is too long (${sleepDuration.toFixed(1)} hours). Are you sure?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: saveUserData },
        ]
      );
      return;
    }

    saveUserData();
  };

  // SAVE USER DATA TO LOCAL STORAGE
 const saveUserData = async () => {
  setLoading(true);
  try {
    const userData = {
      name: name.trim(),
      sleepTime: sleepTime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      sleepDuration: calculateSleepDuration(sleepTime, wakeTime),
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    setLoading(false);

    // ✅ NAVIGATION HERE
    router.replace('/Sleep/HomeScreen');

  } catch (error) {
    setLoading(false);
    Alert.alert('Save Failed', error.message);
  }
};


  // FORMAT TIME FOR DISPLAY
  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  // HANDLE TIME PICKERS
  const handleSleepTimeChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowSleepPicker(false);
    if (selectedDate) setSleepTime(selectedDate);
  };

  const handleWakeTimeChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowWakePicker(false);
    if (selectedDate) setWakeTime(selectedDate);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>💤 Sleep Reminder</Text>
          <Text style={styles.subtitle}>Track Your Sleep Schedule</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌙 Sleep Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowSleepPicker(true)}
            disabled={loading}
          >
            <Text style={styles.timeButtonText}>{formatTime(sleepTime)}</Text>
            <Text style={styles.timeIcon}>⏰</Text>
          </TouchableOpacity>

          {showSleepPicker && (
            <DateTimePicker
              value={sleepTime}
              mode="time"
              display="spinner"
              onChange={handleSleepTimeChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>☀️ Wake Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowWakePicker(true)}
            disabled={loading}
          >
            <Text style={styles.timeButtonText}>{formatTime(wakeTime)}</Text>
            <Text style={styles.timeIcon}>⏰</Text>
          </TouchableOpacity>

          {showWakePicker && (
            <DateTimePicker
              value={wakeTime}
              mode="time"
              display="spinner"
              onChange={handleWakeTimeChange}
            />
          )}
        </View>

        <View
          style={[
            styles.durationContainer,
            sleepDuration >= 8 ? styles.durationValid : styles.durationInvalid,
          ]}
        >
          <Text style={styles.durationLabel}>⏱ Sleep Duration</Text>
          <Text style={styles.durationValue}>
            {sleepDuration.toFixed(1)} hrs
          </Text>
          <Text style={styles.durationNote}>
            {sleepDuration < 8
              ? '❌ Must be at least 8 hours'
              : sleepDuration > 12
              ? '⚠️ That’s quite long!'
              : '✅ Perfect!'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Starting...' : '✅ Start Sleep Tracking'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a2e' },
  container: { flexGrow: 1, padding: 20, backgroundColor: '#1a1a2e' },
  header: { marginBottom: 30 },
  title: { fontSize: 34, fontWeight: '800', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, color: '#fff', fontWeight: '700' },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  timeButton: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: '#00d4ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeButtonText: { fontSize: 20, color: '#00d4ff', fontWeight: '700' },
  timeIcon: { fontSize: 22 },
  durationContainer: {
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  durationValid: { borderColor: '#4CAF50' },
  durationInvalid: { borderColor: '#FF5459' },
  durationLabel: { color: '#aaa', fontSize: 14 },
  durationValue: { fontSize: 30, color: '#00d4ff', fontWeight: '800' },
  durationNote: { color: '#ccc' },
  button: {
    backgroundColor: '#00d4ff',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
});
