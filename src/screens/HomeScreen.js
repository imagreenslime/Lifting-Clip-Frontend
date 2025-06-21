// src/screens/HomeScreen.js

import React from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import SessionCard from '../components/SessionCard';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';

export default function HomeScreen() {
  const { sessions, addSession } = useUserSessions();
  const { setSelectedSessionId, setView } = useNavigation();
  console.log(sessions);

  const handleAddSession = async () => {
    const newSession = await addSession();
    setSelectedSessionId(newSession.id);
    setView('SessionDetail');
  };

  const renderSession = ({ item }) => (
    <View style={styles.card}>
      <SessionCard item={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        ListEmptyComponent={<View style={{ padding: 20 }}><Button title="➕ Add Session" onPress={handleAddSession} /></View>}
      />
      {sessions.length > 0 && (
        <View style={{ padding: 20 }}>
          <Button title="➕ Add Session" onPress={handleAddSession} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
