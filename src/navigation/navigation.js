// src/navigation/navigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../providers/NavigationContext';
import HomeScreen from '../screens/HomeScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import SetDetailScreen from '../screens/SetDetailsScreen';
import BluetoothConnectScreen from '../screens/BluetoothConnectScreen';
import AccountScreen from '../screens/AccountScreen';
// TODO LIST
// 1) Firebase authentification
// 2) Add database and etc.
// 3) UseContext() to remove prop drilling


export default function Navigation() {
  const {
    tab, setTab,
    view, setView,
  } = useApp();
  

  const renderScreen = () => {
    if (tab === 'Bluetooth') return <BluetoothConnectScreen />;
    if (view === 'Home') return <HomeScreen />;
    if (view === 'SessionDetail') return <SessionDetailScreen />;
    if (view === 'Account') return <AccountScreen />;
    if (view === 'SetDetail') return <SetDetailScreen/>;
  };

  return (

    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => { setTab('Home'); setView('Home'); }} style={styles.tab}>
          <Text style={styles.tabText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setTab('Bluetooth'); setView('Bluetooth'); }} style={styles.tab}>
          <Text style={styles.tabText}>Bluetooth</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setTab('Account'); setView('Account'); }} style={styles.tab}>
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
