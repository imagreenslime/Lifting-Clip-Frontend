// App.tsx
import React from 'react';
import { View, StyleSheet} from 'react-native';
import { NavigationProvider } from './src/context/NavigationContext';
import Navigation from './src/navigation/navigation';
import SafeAreaWrapper from './src/components/SafeAreaWrapper';
import { AuthProvider } from './src/auth/AuthProvider';
import { PaperProvider } from 'react-native-paper';
const App = () => {

  return (
      <AuthProvider>
        <PaperProvider>
          <SafeAreaWrapper>
              <NavigationProvider>
                <Navigation />
              </NavigationProvider>
            </SafeAreaWrapper>
        </PaperProvider>
      </AuthProvider>
  );
};



export default App;

