// HomeScreen.js - NO NAME VERSION
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

const SCREEN_CHECK_INTERVAL = 2 * 60 * 1000; // 2 minutes

export default function HomeScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Monitoring...');
  const [isSleepPeriod, setIsSleepPeriod] = useState(false);
  
  const appState = useRef(AppState.currentState);
  const screenCheckTimer = useRef(null);
  const mainCheckTimer = useRef(null);
  const sleepReminderSent = useRef(false);
  const wakeReminderSent = useRef(false);

  useEffect(() => {
    loadUserData();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
      clearAllTimers();
    };
  }, []);

  // LOAD USER DATA
  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsed = JSON.parse(data);
        setUserData(parsed);
        startMainMonitoring(parsed);
      } else {
        router.replace('/(Screens)/Login');
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  // MAIN MONITORING LOOP
  const startMainMonitoring = (data) => {
    const checkStatus = () => {
      if (!data) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const sleepTime = new Date(data.sleepTime);
      const wakeTime = new Date(data.wakeTime);

      const sleepMinutes = sleepTime.getHours() * 60 + sleepTime.getMinutes();
      const wakeMinutes = wakeTime.getHours() * 60 + wakeTime.getMinutes();

      const inSleepPeriod = isTimeBetween(currentMinutes, sleepMinutes, wakeMinutes);
      setIsSleepPeriod(inSleepPeriod);

      if (inSleepPeriod) {
        if (!sleepReminderSent.current) {
          sendSleepReminder();
          sleepReminderSent.current = true;
          wakeReminderSent.current = false;
        }
        setCurrentStatus('⏰ In Sleep Period - Screen OFF!');
      } else {
        sleepReminderSent.current = false;

        if (isTimeClose(currentMinutes, sleepMinutes, 10)) {
          const minutesUntilSleep =
            sleepMinutes > currentMinutes
              ? sleepMinutes - currentMinutes
              : 1440 - currentMinutes + sleepMinutes;

          setCurrentStatus(`⏰ ${minutesUntilSleep} minutes until sleep time`);
        } else if (isTimeClose(currentMinutes, wakeMinutes, 10)) {
          if (!wakeReminderSent.current) {
            sendWakeReminder();
            wakeReminderSent.current = true;
          }
          setCurrentStatus('☀️ Time to Wake Up!');
        } else {
          const minutesUntilSleep =
            sleepMinutes > currentMinutes
              ? sleepMinutes - currentMinutes
              : 1440 - currentMinutes + sleepMinutes;

          setCurrentStatus(`⏱ ${(minutesUntilSleep / 60).toFixed(1)} hours until sleep time`);
        }
      }
    };

    checkStatus();
    if (mainCheckTimer.current) clearInterval(mainCheckTimer.current);
    mainCheckTimer.current = setInterval(checkStatus, 30 * 1000);
  };

  // APP STATE DETECTION
  const handleAppStateChange = async (nextAppState) => {
    if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
      clearScreenCheckTimer();
    }

    if (nextAppState === 'active' && appState.current.match(/inactive|background/)) {
      if (isSleepPeriod) {
        await sendScreenOnReminder();
        startScreenCheckTimer();
      }
    }

    appState.current = nextAppState;
  };

  // NOTIFICATIONS
  const sendSleepReminder = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Go to Sleep!',
        body: `It's your sleep time. Please turn off the screen and go to bed now.`,
        sound: true,
      },
      trigger: null,
    });
  };

  const sendWakeReminder = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '☀️ Time to Wake Up!',
        body: `Good morning! Time to start your day.`,
        sound: true,
      },
      trigger: null,
    });
  };

  const sendScreenOnReminder = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📱 Screen is ON!',
        body: `Your screen is on during sleep time. Please turn it off and go to sleep!`,
        sound: true,
      },
      trigger: null,
    });
  };

  // SCREEN CHECK TIMER
  const startScreenCheckTimer = () => {
    if (screenCheckTimer.current) clearInterval(screenCheckTimer.current);

    screenCheckTimer.current = setInterval(async () => {
      if (AppState.currentState === 'active' && isSleepPeriod) {
        await sendScreenOnReminder();
      }
    }, SCREEN_CHECK_INTERVAL);
  };

  const clearScreenCheckTimer = () => {
    if (screenCheckTimer.current) {
      clearInterval(screenCheckTimer.current);
      screenCheckTimer.current = null;
    }
  };

  const clearAllTimers = () => {
    clearScreenCheckTimer();
    if (mainCheckTimer.current) clearInterval(mainCheckTimer.current);
  };

  // HELPERS
  const isTimeBetween = (current, sleep, wake) => {
    return sleep < wake
      ? current >= sleep && current < wake
      : current >= sleep || current < wake;
  };

  const isTimeClose = (current, target, window) => {
    const diff = Math.abs(current - target);
    return diff <= window || diff >= 1440 - window;
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

 const handleChangeSchedule = async () => {
  Alert.alert(
    'Change Sleep Schedule',
    'This will reset your schedule and stop monitoring.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Change',
        onPress: async () => {
          clearAllTimers();
          await AsyncStorage.removeItem('userData');
          await Notifications.cancelAllScheduledNotificationsAsync();

          // 👉 Go to Timer / Sleep Setup page
          router.replace('/Sleep/Time');
        },
      },
    ]
  );
};


  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💤 Sleep Tracker</Text>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>🌙 Sleep Time:</Text>
          <Text style={styles.value}>{formatTime(new Date(userData.sleepTime))}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>☀️ Wake Time:</Text>
          <Text style={styles.value}>{formatTime(new Date(userData.wakeTime))}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>⏱ Duration:</Text>
          <Text style={styles.value}>{userData.sleepDuration.toFixed(1)} hours</Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>Current Status</Text>
          <Text style={styles.statusText}>{currentStatus}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangeSchedule}>
        <Text style={styles.buttonText}>Change Sleep Schedule</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20 },
  title: { fontSize: 28, color: '#fff', textAlign: 'center', marginTop: 60, marginBottom: 30 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  label: { fontSize: 16, color: '#ccc' },
  value: { fontSize: 16, color: '#fff', fontWeight: '700' },
  statusBox: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  statusTitle: { color: '#00d4ff', textAlign: 'center', marginBottom: 8 },
  statusText: { color: '#4CAF50', textAlign: 'center', fontWeight: '600' },
  button: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  buttonText: { color: '#00d4ff', fontWeight: '700' },
  loadingText: { color: '#fff', textAlign: 'center', marginTop: 100 },
});
