// src/navigation/navigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { HomeScreen, SessionDetailScreen, SetDetailScreen, BluetoothConnectScreen, AccountScreen, LoginScreen, RegisterScreen } from '../screens'
// TODO LIST
// rework bluetooth recording screen to work with firestore
/

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
