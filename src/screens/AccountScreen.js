// src/screens/AccountScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation } from '../context/NavigationContext';
import { Button, IconButton } from 'react-native-paper';

export default function AccountScreen() {
  const { setView } = useNavigation();
  const { user } = useAuth();
  const [profile, setProfile] = useState({ height: '', weight: '', age: '', gender: '' });
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (user?.uid) fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const ref = doc(db, 'users', user.uid, 'profile', 'info');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          height: data.height?.toString() || '',
          weight: data.weight?.toString() || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
        });
      }
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
    }
  };

  const updateUserProfile = async () => {
    if (!user?.uid) return;
    try {
      const ref = doc(db, 'users', user.uid, 'profile', 'info');
      await setDoc(
        ref,
        {
          height: Number(profile.height),
          weight: Number(profile.weight),
          age: Number(profile.age),
          gender: profile.gender,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      alert('Profile updated');
    } catch (e) {
      console.error('Failed to update user profile:', e);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const renderRow = (label, value, field, keyboardType = 'default') => (
<View style={styles.row}>
  <View style={styles.rowContent}>
    <Text style={styles.label}>{label}</Text>
    {editingField === field ? (
      <TextInput
        style={styles.input}
        keyboardType={keyboardType}
        value={profile[field]}
        onChangeText={(v) => setProfile((prev) => ({ ...prev, [field]: v }))}
        autoFocus
      />
    ) : (
      <Text style={styles.value}>{value || '-'}</Text>
    )}
  </View>

  {editingField === field ? (
    <IconButton
      icon="check"
      iconColor="#4CAF50"
      size={20}
      onPress={() => setEditingField(null)}
    />
  ) : (
    <IconButton
      icon="pencil"
      iconColor="#4A90E2"
      size={20}
      onPress={() => setEditingField(field)}
    />
  )}
</View>

  );

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.header}>Logged in as: {user.email}</Text>
          <Button mode="contained" style={styles.logoutButton} onPress={handleLogout}>
            Logout
          </Button>

          {renderRow('Height (in)', profile.height, 'height', 'numeric')}
          {renderRow('Weight (lb)', profile.weight, 'weight', 'numeric')}
          {renderRow('Age', profile.age, 'age', 'numeric')}
          {renderRow('Gender', profile.gender, 'gender')}

          <Button mode="contained" style={styles.saveButton} onPress={updateUserProfile}>
            Save Profile
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.header}>You are not logged in.</Text>
          <Button mode="contained" style={styles.authButton} onPress={() => setView('Login')}>
            Login
          </Button>
          <Button mode="outlined" style={styles.authButton} onPress={() => setView('Register')}>
            Register
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
  },
  rowContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
  },
  logoutButton: {
    marginBottom: 20,
    backgroundColor: '#D9534F',
  },
  authButton: {
    marginTop: 12,
  },
});
