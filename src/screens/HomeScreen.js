import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import SessionCard from '../components/SessionCard';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import { Button } from 'react-native-paper';

export default function HomeScreen() {
  const { sessions, addSession } = useUserSessions();
  const { setSelectedSessionId, setView } = useNavigation();

  const handleAddSession = async () => {
    const newSession = await addSession();
    setSelectedSessionId(newSession.id);
    setView('SessionDetail');
  };

  const renderSession = ({ item }) => (
    <View style={styles.cardWrapper}>
      <SessionCard item={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        ListEmptyComponent={<Text style={styles.emptyText}>No sessions yet.</Text>}
      />

      <Button mode="contained" onPress={handleAddSession} style={styles.addButton}>
        + Add Session
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  addButton: {
    marginVertical: 16,
    backgroundColor: '#e74c3c',
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});