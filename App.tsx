import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView, StyleSheet} from 'react-native';
import BluetoothScreen from './src/screens/BluetoothScreen';


const App = () => {
  return (
    <View style={styles.container}> 
      <BluetoothScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;

