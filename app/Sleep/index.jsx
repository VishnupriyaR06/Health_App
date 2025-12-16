// app/index.jsx
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>😴 Sleep Reminder</Text>
      <Text style={styles.subtitle}>Track your sleep schedule locally</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Sleep/Login')}
      >
        <Text style={styles.text}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    marginBottom: 50,
    textAlign: 'center'
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    backgroundColor: '#00d4ff',
    borderRadius: 12
  },
  text: { 
    color: '#1a1a2e', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});
