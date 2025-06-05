// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView, StyleSheet} from 'react-native';

import Navigation from './src/navigation/navigation';
import SafeAreaWrapper from './src/components/SafeAreaWrapper';


const App = () => {
  return (
    <View style={styles.container}>
      <SafeAreaWrapper>
        <Navigation />
      </SafeAreaWrapper>
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

