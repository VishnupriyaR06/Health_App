import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

export default function StepTracker() {
  const router = useRouter();
  const [steps, setSteps] = useState(0);
  const [goal, setGoal] = useState(600);
  const [distance, setDistance] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const subscription = useRef(null);
  const lastStepTime = useRef(Date.now());
  const accelerometerData = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    setupNotifications();
    loadGoal();
    loadTodaySteps();
    startAccelerometer();

    return () => {
      stopAccelerometer();
    };
  }, []);

  useEffect(() => {
    if (steps >= goal && goal > 0 && !goalAchieved && steps > 0) {
      setGoalAchieved(true);
      showGoalCompletePopup();
    }
  }, [steps, goal]);

  const startAccelerometer = () => {
    Accelerometer.setUpdateInterval(100); // Update every 100ms

    subscription.current = Accelerometer.addListener(accelerometerData => {
      detectStep(accelerometerData);
    });
    
    setIsTracking(true);
  };

  const stopAccelerometer = () => {
    if (subscription.current) {
      subscription.current.remove();
    }
    setIsTracking(false);
  };

  // Simple step detection algorithm
  const detectStep = (data) => {
    const { x, y, z } = data;
    
    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    // Threshold for detecting a step (adjust if needed)
    const threshold = 1.3;
    
    // Check if magnitude exceeds threshold and enough time passed
    const currentTime = Date.now();
    const timeDiff = currentTime - lastStepTime.current;
    
    // Minimum 300ms between steps (to avoid double counting)
    if (magnitude > threshold && timeDiff > 300) {
      lastStepTime.current = currentTime;
      incrementStep();
    }
  };

  const incrementStep = () => {
    setSteps(prevSteps => {
      const newSteps = prevSteps + 1;
      calculateDistance(newSteps);
      saveSteps(newSteps);
      return newSteps;
    });
  };

  const showGoalCompletePopup = () => {
    setShowCelebration(true);
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true
    }).start();

    Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Goal Achieved!',
        body: `Congratulations! Neenga ${goal} steps complete panniteenga!`,
        sound: true,
      },
      trigger: null,
    });
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  };

  const loadGoal = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem('dailyStepGoal');
      if (savedGoal) {
        setGoal(parseInt(savedGoal));
      }
    } catch (error) {
      console.log('Goal load error:', error);
    }
  };

  const loadTodaySteps = async () => {
    try {
      const today = new Date().toDateString();
      const savedSteps = await AsyncStorage.getItem(`steps_${today}`);
      
      if (savedSteps) {
        const stepCount = parseInt(savedSteps);
        setSteps(stepCount);
        calculateDistance(stepCount);
      }
    } catch (error) {
      console.log('Steps load error:', error);
    }
  };

  const saveSteps = async (stepCount) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`steps_${today}`, stepCount.toString());
    } catch (error) {
      console.log('Steps save error:', error);
    }
  };

  const calculateDistance = (stepCount) => {
    const distanceInKm = (stepCount * 0.762) / 1000;
    setDistance(distanceInKm.toFixed(2));
  };

  const closePopup = () => {
    setShowCelebration(false);
    scaleAnim.setValue(0);
  };

  const resetSteps = () => {
    setSteps(0);
    setDistance(0);
    setGoalAchieved(false);
    saveSteps(0);
  };

  const progressPercentage = ((steps / goal) * 100).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Progress</Text>

      <View style={styles.statsCard}>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, isTracking && styles.activeDot]} />
          <Text style={styles.statusText}>
            {isTracking ? 'Tracking Active' : 'Not Tracking'}
          </Text>
        </View>
        
        <Text style={styles.label}>Steps Taken</Text>
        <Text style={styles.bigNumber}>{steps}</Text>
        <Text style={styles.goalText}>Goal: {goal} steps</Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(progressPercentage, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.percentage}>{progressPercentage}% Complete</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.label}>Distance Covered</Text>
        <Text style={styles.bigNumber}>{distance} km</Text>
        <Text style={styles.subtext}>Approx. {(distance * 1000).toFixed(0)} meters</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ✓ Phone pocket-la vechutu nadangunga{'\n'}
          ✓ App open pannitu irukkanum{'\n'}
          ✓ Goal achieve aana popup varum
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.changeGoalButton}
          onPress={() => router.push('/Step/Goal')}
        >
          <Text style={styles.changeGoalText}>Change Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetSteps}
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Goal Complete Celebration Popup */}
      <Modal
        transparent={true}
        visible={showCelebration}
        animationType="fade"
        onRequestClose={closePopup}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.celebrationCard,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>Goal Achieved!</Text>
            <Text style={styles.celebrationText}>
              Congratulations!{'\n'}
              Neenga {goal} steps complete panniteenga!
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{steps}</Text>
                <Text style={styles.statLabel}>Steps</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{distance}</Text>
                <Text style={styles.statLabel}>KM</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closePopup}
            >
              <Text style={styles.closeButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333'
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginRight: 8
  },
  activeDot: {
    backgroundColor: '#4CAF50'
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10
  },
  goalText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 15
  },
  subtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6
  },
  percentage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  infoBox: {
    backgroundColor: '#FFF3E0',
    padding: 20,
    borderRadius: 10,
    marginTop: 20
  },
  infoText: {
    fontSize: 14,
    color: '#F57C00',
    lineHeight: 24
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10
  },
  changeGoalButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3'
  },
  changeGoalText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold'
  },
  resetButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f44336'
  },
  resetText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  celebrationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 10
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 20
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15
  },
  celebrationText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 26
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 14,
    color: '#999'
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
