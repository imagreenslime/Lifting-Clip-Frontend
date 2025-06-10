// src/screens/AccountScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { auth } from '../../firebaseConfig';

export default function AccountScreen({ navigation }) {
  const { user } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {user ? (
        <>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Logged in as: {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>You are not logged in.</Text>
          <Button title="Login" onPress={() => navigation.navigate('Login')} />
          <View style={{ height: 10 }} />
          <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </>
      )}
    </View>
  );
}
