import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Goal() {
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState('');
  const [savedGoal, setSavedGoal] = useState(null);

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      const goal = await AsyncStorage.getItem('dailyStepGoal');
      if (goal) {
        setSavedGoal(goal);
        setDailyGoal(goal);
      }
    } catch (error) {
      console.log('Error loading goal:', error);
    }
  };

  const saveGoal = async () => {
    if (!dailyGoal || parseInt(dailyGoal) <= 0) {
      Alert.alert('Error', 'Valid step goal enter pannunga!');
      return;
    }

    try {
      await AsyncStorage.setItem('dailyStepGoal', dailyGoal);
      setSavedGoal(dailyGoal);
      
      // Goal save aana udane StepTracker screen-ku pogum
      Alert.alert(
        'Success', 
        `Daily goal: ${dailyGoal} steps set aagiduchi!`,
        [
          {
            text: 'Start Tracking',
            onPress: () => router.push('/Step/StepTracker')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Goal save aagala, try again!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Step Goal</Text>
      
      {savedGoal && (
        <View style={styles.currentGoal}>
          <Text style={styles.currentText}>Current Goal:</Text>
          <Text style={styles.goalNumber}>{savedGoal} steps</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter daily step goal (e.g., 600)"
        keyboardType="numeric"
        value={dailyGoal}
        onChangeText={setDailyGoal}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={saveGoal}>
        <Text style={styles.buttonText}>Save Goal & Start</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Goal set pannitu automatic-a tracking start aagum{'\n'}
        Steps complete aana notification varum!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333'
  },
  currentGoal: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center'
  },
  currentText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10
  },
  goalNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff'
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  info: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 22
  }
});
