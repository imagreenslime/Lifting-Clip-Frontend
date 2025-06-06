import React from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity, Text, Button } from 'react-native';
import SessionCard from '../components/SessionCard';



export default function HomeScreen({ sessions, onSessionPress, onDeleteSession, onRenameSession, onAddSession}) {
  const promptRename = (id) => {
    Alert.prompt('Rename Session', 'Enter new name:', (text) => {
      if (text.trim()) onRenameSession(id, text);
    })};
    return (
      <View style={styles.container}>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <SessionCard item={item} onSessionPress={onSessionPress} promptRename={promptRename} onDeleteSession={onDeleteSession}/>
            </View>
          )}
        />
      <View style={{ padding: 20 }}>
      <Button title="➕ Add Session" onPress={onAddSession} />
      </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
  });
