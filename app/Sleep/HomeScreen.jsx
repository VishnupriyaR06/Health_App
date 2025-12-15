// HomeScreen.js - FIXED VERSION
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

  // LOAD USER DATA FROM STORAGE
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

  // MAIN MONITORING LOOP - Checks every 30 seconds
  const startMainMonitoring = (data) => {
    console.log('🔄 Starting main monitoring loop');
    
    const checkStatus = () => {
      if (data) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        const sleepTime = new Date(data.sleepTime);
        const sleepMinutes = sleepTime.getHours() * 60 + sleepTime.getMinutes();
        
        const wakeTime = new Date(data.wakeTime);
        const wakeMinutes = wakeTime.getHours() * 60 + wakeTime.getMinutes();
        
        const inSleepPeriod = isTimeBetween(currentMinutes, sleepMinutes, wakeMinutes);
        
        setIsSleepPeriod(inSleepPeriod);
        
        if (inSleepPeriod) {
          // DURING SLEEP PERIOD
          if (!sleepReminderSent.current) {
            sendSleepReminder(data);
            sleepReminderSent.current = true;
            wakeReminderSent.current = false;
          }
          setCurrentStatus('⏰ In Sleep Period - Screen OFF!');
        } else {
          // DURING WAKE PERIOD
          sleepReminderSent.current = false;
          
          if (isTimeClose(currentMinutes, sleepMinutes, 10)) {
            // Within 10 minutes of sleep time
            const minutesUntilSleep = sleepMinutes > currentMinutes 
              ? sleepMinutes - currentMinutes 
              : (1440 - currentMinutes) + sleepMinutes;
            setCurrentStatus(`⏰ ${minutesUntilSleep} minutes until sleep time`);
          } else if (isTimeClose(currentMinutes, wakeMinutes, 10)) {
            // Within 10 minutes of wake time
            if (!wakeReminderSent.current) {
              sendWakeReminder(data);
              wakeReminderSent.current = true;
            }
            setCurrentStatus('☀️ Time to Wake Up!');
          } else {
            const minutesUntilSleep = sleepMinutes > currentMinutes 
              ? sleepMinutes - currentMinutes 
              : (1440 - currentMinutes) + sleepMinutes;
            const hoursUntilSleep = (minutesUntilSleep / 60).toFixed(1);
            setCurrentStatus(`⏱ ${hoursUntilSleep} hours until sleep time`);
          }
        }
      }
    };
    
    // Check immediately and then every 30 seconds
    checkStatus();
    
    if (mainCheckTimer.current) clearInterval(mainCheckTimer.current);
    mainCheckTimer.current = setInterval(checkStatus, 30 * 1000);
  };

  // SCREEN ON DETECTION
  const handleAppStateChange = async (nextAppState) => {
    console.log('AppState:', appState.current, '->', nextAppState);

    // Screen went OFF
    if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
      console.log('📱 Screen OFF');
      clearScreenCheckTimer();
    }

    // Screen came ON
    if (nextAppState === 'active' && appState.current.match(/inactive|background/)) {
      console.log('📱 Screen ON detected');
      
      if (isSleepPeriod) {
        await sendScreenOnReminder();
        startScreenCheckTimer();
      }
    }

    appState.current = nextAppState;
  };

  // SEND NOTIFICATIONS
  const sendSleepReminder = async (data) => {
    console.log('🌙 Sending Sleep Reminder');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Go to Sleep!',
        body: `Hey ${data.name}! It's your sleep time. Please turn off the screen and go to bed now.`,
        sound: true,
        data: { type: 'sleep_reminder' }
      },
      trigger: null, // Send immediately
    });
  };

  const sendWakeReminder = async (data) => {
    console.log('☀️ Sending Wake Reminder');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '☀️ Time to Wake Up!',
        body: `Good morning ${data.name}! Time to start your day.`,
        sound: true,
        data: { type: 'wake_reminder' }
      },
      trigger: null,
    });
  };

  const sendScreenOnReminder = async () => {
    if (!userData) return;
    
    console.log('🚨 Sending Screen ON Reminder');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📱 Screen is ON!',
        body: `${userData.name}, your screen is on during sleep time. Please turn it off and go to sleep!`,
        sound: true,
        data: { type: 'screen_on_reminder' }
      },
      trigger: null,
    });
  };

  const sendEarlyWakeReminder = async () => {
    if (!userData) return;
    
    const wakeTime = new Date(userData.wakeTime);
    const now = new Date();
    const hoursRemaining = ((wakeTime.getTime() - now.getTime()) / (1000 * 60 * 60)).toFixed(1);
    
    console.log('⚠️ Sending Early Wake Reminder');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ You Woke Up Early!',
        body: `You have ${hoursRemaining} hours left to sleep. Please go back to bed!`,
        sound: true,
        data: { type: 'early_wake_reminder' }
      },
      trigger: null,
    });
  };

  // SCREEN CHECK TIMER (Every 2 minutes while screen is on during sleep time)
  const startScreenCheckTimer = () => {
    console.log('⏰ Starting 2-minute screen check');
    
    if (screenCheckTimer.current) clearTimeout(screenCheckTimer.current);
    
    screenCheckTimer.current = setInterval(async () => {
      if (AppState.currentState === 'active' && isSleepPeriod) {
        console.log('🚨 Screen still ON after 2 minutes!');
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

  // HELPER FUNCTIONS
  const isTimeBetween = (current, sleep, wake) => {
    if (sleep < wake) {
      return current >= sleep && current < wake;
    } else {
      return current >= sleep || current < wake;
    }
  };

  const isTimeClose = (current, target, minutesWindow) => {
    const diff = Math.abs(current - target);
    return diff <= minutesWindow || diff >= (1440 - minutesWindow);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

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
            router.replace('/(Screens)/Login');
          }
        }
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
        <Text style={styles.greeting}>Hello, {userData.name}! 👋</Text>
        
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

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 How It Works:</Text>
        <Text style={styles.infoText}>
          ✓ Sleep time notification{'\n'}
          ✓ Every 2 min: Screen ON check{'\n'}
          ✓ Wake time notification{'\n'}
          ✓ Early wake-up warning{'\n'}
          ✓ Runs in background
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangeSchedule}>
        <Text style={styles.buttonText}>Change Sleep Schedule</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 30
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460'
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00d4ff',
    marginBottom: 25,
    textAlign: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460'
  },
  label: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '500'
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700'
  },
  statusBox: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  statusTitle: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center'
  },
  statusText: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center'
  },
  infoCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460'
  },
  infoTitle: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: '700',
    marginBottom: 10
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22
  },
  button: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff'
  },
  buttonText: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: '700'
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100
  }
});
