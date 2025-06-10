// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView, StyleSheet} from 'react-native';
import { NavigationProvider } from './src/providers/NavigationContext';
import Navigation from './src/navigation/navigation';
import SafeAreaWrapper from './src/components/SafeAreaWrapper';
import { AuthProvider } from './src/auth/AuthProvider';

const App = () => {

  return (
    <AuthProvider>
      <View style={styles.container}>
        <SafeAreaWrapper>
          <NavigationProvider>
            <Navigation />
          </NavigationProvider>
        </SafeAreaWrapper>
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;

