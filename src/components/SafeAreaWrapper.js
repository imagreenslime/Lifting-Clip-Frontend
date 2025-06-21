// src/components/SafeAreaWrapper.js

import React from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeAreaWrapper({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop:
            Platform.OS === 'android'
              ? StatusBar.currentHeight || insets.top || 24
              : insets.top || 44,
          paddingBottom: insets.bottom || 16,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#121212', // match your app dark theme
    paddingHorizontal: 16,      // nice side padding for all screens
  },
});
