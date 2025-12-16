import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Time() {
  const router = useRouter();

  const [sleepTime, setSleepTime] = useState(new Date(2024, 0, 1, 22, 30));
  const [wakeTime, setWakeTime] = useState(new Date(2024, 0, 2, 8, 0));
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Enable notifications for reminders');
    }
  };

  const calculateSleepDuration = (sleep, wake) => {
    let diff = wake.getTime() - sleep.getTime();
    if (diff < 0) diff += 24 * 60 * 60 * 1000;
    return diff / (1000 * 60 * 60);
  };

  const sleepDuration = calculateSleepDuration(sleepTime, wakeTime);

  const handleSave = async () => {
    if (sleepDuration < 8) {
      Alert.alert('Warning', 'Sleep must be at least 8 hours');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        sleepTime: sleepTime.toISOString(),
        wakeTime: wakeTime.toISOString(),
        sleepDuration,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      Alert.alert('Success', 'Sleep tracking started ✅', [
        {
          text: 'OK',
          onPress: () => router.push('/Sleep/HomeScreen'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>💤 Sleep Setup</Text>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowSleepPicker(true)}
        >
          <Text style={styles.timeText}>Sleep: {formatTime(sleepTime)}</Text>
        </TouchableOpacity>

        {showSleepPicker && (
          <DateTimePicker
            value={sleepTime}
            mode="time"
            onChange={(e, d) => {
              setShowSleepPicker(false);
              if (d) setSleepTime(d);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowWakePicker(true)}
        >
          <Text style={styles.timeText}>Wake: {formatTime(wakeTime)}</Text>
        </TouchableOpacity>

        {showWakePicker && (
          <DateTimePicker
            value={wakeTime}
            mode="time"
            onChange={(e, d) => {
              setShowWakePicker(false);
              if (d) setWakeTime(d);
            }}
          />
        )}

        <Text style={styles.duration}>
          ⏱ {sleepDuration.toFixed(1)} hours
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a2e' },
  container: { padding: 20 },
  title: { color: '#fff', fontSize: 28, textAlign: 'center', marginBottom: 20 },
  timeButton: {
    backgroundColor: '#16213e',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
  },
  timeText: { color: '#00d4ff', fontSize: 18 },
  duration: { color: '#fff', textAlign: 'center', marginVertical: 20 },
  button: {
    backgroundColor: '#00d4ff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold', color: '#1a1a2e', fontSize: 18 },
});
