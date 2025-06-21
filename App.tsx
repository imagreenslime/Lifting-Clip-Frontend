// App.tsx
import React from 'react';
import { View, StyleSheet} from 'react-native';
import { NavigationProvider } from './src/context/NavigationContext';
import Navigation from './src/navigation/navigation';
import SafeAreaWrapper from './src/components/SafeAreaWrapper';
import { AuthProvider } from './src/auth/AuthProvider';

const App = () => {

  return (
      <AuthProvider>
              <SafeAreaWrapper>
                <NavigationProvider>
                  <Navigation />
                </NavigationProvider>
              </SafeAreaWrapper>
      </AuthProvider>
  );
};



export default App;

