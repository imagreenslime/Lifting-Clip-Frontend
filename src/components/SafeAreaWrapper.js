import React from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';

export default function SafeAreaWrapper({ children }) {
  const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  const bottomPadding = Platform.OS === 'android' ? 16 : 34; // enough for gesture nav / home bar

  return (
    <View style={[styles.wrapper, { paddingTop: topPadding, paddingBottom: bottomPadding }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white', // optional: match your theme
  },
});
