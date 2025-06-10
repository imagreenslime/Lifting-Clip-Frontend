// src/screens/HomeScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import SessionCard from '../components/SessionCard';
import { useNavigation } from '../context/NavigationContext';


export default function HomeScreen({}) {
  const {
    sessions, setSelectedSession,
    setSessions, setView
  } = useNavigation();

  const addSession = () => {
    const newSession = {
      id: Date.now().toString(),
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      sets: [],
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setSelectedSession(newSession);
    setView('SessionDetail');
  };

    return (
      <View style={styles.container}>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <SessionCard item={item}/>
            </View>
          )}
        />
      <View style={{ padding: 20 }}>
      <Button title="➕ Add Session" onPress={addSession} />
      </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
  });
