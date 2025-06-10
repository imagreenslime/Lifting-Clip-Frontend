// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from '../../firebaseConfig'
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { useNavigation } from '../context/NavigationContext';

export default function RegisterScreen() {
  const {setView} = useNavigation();
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

      const sessionsRef = collection(db, 'users', uid, 'sessions');
      await addDoc(sessionsRef, {
        name: 'Sample Session',
        date: new Date().toISOString().split('T')[0],
        id: 1,
        sets: [
          {
            id: Date.now().toString(),
            exercise: 'Sample Bench Press',
            duration: '30s',
            repdata: {
              rep1: {
                id: 'rep1',
                duration: '12.5s',
                rom: '25.4 inches',
                tempo: '1.25s-5.5s-6.25s'
              },
              rep2: {
                id: 'rep2',
                duration: '12.5s',
                rom: '26 inches',
                tempo: '1.25s-5.5s-6.25s'
              }
            }
          }
        ]
      });

      Alert.alert('Success', 'Account created!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <Button title={loading ? 'Creating...' : 'Register'} onPress={handleRegister} disabled={loading} />
      <Button title="If not made account yet" onPress={() => setView('Login')}></Button>
    </View>
  );
}
