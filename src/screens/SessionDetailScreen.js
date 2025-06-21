import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import SetCard from '../components/SetCard';
import BluetoothRecordingScreen from './BluetoothRecordingScreen';
import { IconButton, Button } from 'react-native-paper';

export default function SessionDetailScreen() {
  const { selectedSessionId, view, setView } = useNavigation();
  const { sessions, fetchSets, addSet } = useUserSessions();

  const [sets, setSets] = useState([]);

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const goBack = () => {
    if (view === 'SetDetail') setView('SessionDetail');
    else if (view === 'SessionDetail') setView('Home');
  };

  const loadSets = async () => {
    if (selectedSessionId) {
      const newSets = await fetchSets(selectedSessionId);
      setSets(newSets);
    }
  };

  useEffect(() => {
    loadSets();
  }, [selectedSessionId]);

  const handleAddSet = async () => {
    await addSet(selectedSessionId);
    await loadSets();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={28}
          onPress={goBack}
          style={styles.backBtn}
        />
        <Text style={styles.header}>{selectedSession?.name}</Text>
      </View>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SetCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Button mode="contained" onPress={handleAddSet} style={styles.addButton}>
        + Add Set
      </Button>

      <BluetoothRecordingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  addButton: {
    marginVertical: 16,
    backgroundColor: '#e74c3c',
  },
});