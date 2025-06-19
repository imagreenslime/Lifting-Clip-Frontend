// src/navigation/navigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { HomeScreen, SessionDetailScreen, SetDetailScreen, BluetoothConnectScreen, AccountScreen, LoginScreen, RegisterScreen, LiftsScreen} from '../screens'
// TODO LIST

// BACKEND/UX
// rework bluetooth recording screen to work with firestore
// add rep/adjust rep function
// database of which exercises to choose from and send to backend: squat, bench, deadlift, cable, etc.
// input height, weight, age, etc on account pfp, put into firestore

// UI
// tab for supported exercises
// make buttons bigger, wider, and rectangular shaped, 
// animations
// 3 dots on each session instead of 1 million buttons
// instead of opening new page, create table that still shows home page in the background 
// show amount of sets, reps, etc on session page
// on profile show ammount of workouts, add charts of etc

// people put what RPE it felt like
// average concentric time for RPE will be outputted for each lift
export default function Navigation() {
  const {
    view, setView,
  } = useNavigation();
  

  const renderScreen = () => {
    if (view === 'Bluetooth') return <BluetoothConnectScreen />;
    if (view === 'Home') return <HomeScreen />;
    if (view === 'SessionDetail') return <SessionDetailScreen />;
    if (view === 'SetDetail') return <SetDetailScreen/>;

    if (view === 'Account') return <AccountScreen />;
    if (view === 'Login') return <LoginScreen />;
    if (view === 'Register') return <RegisterScreen />;
    if (view === 'Lifts') return <LiftsScreen />;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => { setView('Home');}} style={styles.tab}>
          <Text style={styles.tabText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setView('Bluetooth');}} style={styles.tab}>
          <Text style={styles.tabText}>Bluetooth</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setView('Account'); }} style={styles.tab}>
          <Text style={styles.tabText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setView('Lifts'); }} style={styles.tab}>
          <Text style={styles.tabText}>Lifts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
  },
});
