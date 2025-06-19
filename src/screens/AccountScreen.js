// src/screens/AccountScreen.js
import React, {useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { auth, db} from '../../firebaseConfig';

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation } from '../context/NavigationContext';
export default function AccountScreen() {
    const { setView } = useNavigation();
    const { user } = useAuth();
    const [profile, setProfile] = useState({ height: '', weight: '', age: '', gender: '' });

    useEffect(() => {
        if (user?.uid) fetchUserProfile();

      }, [user]);
      const fetchUserProfile = async () => {
        try {
          const ref = doc(db, 'users', user.uid, 'profile', 'info');
          console.log('got ref');
          const snap = await getDoc(ref);
          if (snap.exists()) {
            console.log('snap exists');
            const data = snap.data();
            console.log("data exists");
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
          await setDoc(ref, {
            height: Number(profile.height),
            weight: Number(profile.weight),
            age: Number(profile.age),
            gender: profile.gender,
            updatedAt: serverTimestamp(),
          }, { merge: true });
          alert('Profile updated');
        } catch (e) {
          console.error('Failed to update user profile:', e);
          alert('Failed to update profile');
        }
      };
    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        {user ? (
            <>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Logged in as: {user.email}</Text>
            <Button title="Logout" onPress={handleLogout} />
            <View style={styles.container}>
            <Text style={styles.label}>Height (in):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.height}
                onChangeText={v => setProfile(prev => ({ ...prev, height: v }))}
            />

            <Text style={styles.label}>Weight (lb):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.weight}
                onChangeText={v => setProfile(prev => ({ ...prev, weight: v }))}
            />

            <Text style={styles.label}>Age:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.age}
                onChangeText={v => setProfile(prev => ({ ...prev, age: v }))}
            />

            <Text style={styles.label}>Gender:</Text>
            <TextInput
                style={styles.input}
                value={profile.gender}
                onChangeText={v => setProfile(prev => ({ ...prev, gender: v }))}
            />

            <Button title="Save Profile" onPress={updateUserProfile} />
            </View>
            </>
            
        ) : (
            <>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>You are not logged in.</Text>
            <Button title="Login" onPress={() => setView('Login')} />
            <View style={{ height: 10 }} />
            <Button title="Register" onPress={() => setView('Register')} />
            </>
        )}
        </View>
    );
    }

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    marginBottom: 4,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
});