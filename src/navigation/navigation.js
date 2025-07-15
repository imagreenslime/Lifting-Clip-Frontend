// src/navigation/navigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { HomeScreen, SessionDetailScreen, SetDetailScreen, BluetoothConnectScreen, AccountScreen, LoginScreen, RegisterScreen, LiftsScreen} from '../screens'
// TODO LIST

// BACKEND/UX
// rep data doesn't show 1st rep
// update sets after recording

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
        <TouchableOpacity onPress={() => setView('Home')} style={styles.tab}>
          <Icon name="home" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView('Lifts')} style={styles.tab}>
          <Icon name="facebook" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setView('SessionDetail')} style={styles.centerButton}>
          <Icon name="weight-lifter" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setView('Bluetooth')} style={styles.tab}>
          <Icon name="bluetooth" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setView('Account')} style={styles.tab}>
          <Icon name="account-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 0,
    height: 70,
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  centerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
