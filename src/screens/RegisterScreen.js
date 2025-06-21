// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { useNavigation } from '../context/NavigationContext';
import { useUserLifts } from '../hooks/useUserLifts';
import { Button } from 'react-native-paper';

export default function RegisterScreen() {
  const { addLift } = useUserLifts();
  const { setView } = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const uid = auth.currentUser.uid;

      await setDoc(doc(db, 'users', uid), {
        createdAt: new Date().toISOString(),
        email: email,
      });

      const liftsRef = collection(db, 'users', uid, 'lifts');
      await addDoc(liftsRef, { name: 'squat' });
      await addDoc(liftsRef, { name: 'bench' });
      await addDoc(liftsRef, { name: 'deadlift' });

      const profileRef = collection(db, 'users', uid, 'profile');
      await addDoc(profileRef, {
        name: 'profile',
        date: new Date().toISOString().split('T')[0],
        id: 2,
        info: {
          height: '',
          weight: '',
          age: '',
          gender: '',
        },
      });

      Alert.alert('Success', 'Account created!');
      setView('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Register'}
      </Button>

      <Button
        mode="outlined"
        style={styles.switchButton}
        onPress={() => setView('Login')}
      >
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#e74c3c',
    marginBottom: 16,
  },
  switchButton: {
    borderColor: '#4A90E2',
  },
});