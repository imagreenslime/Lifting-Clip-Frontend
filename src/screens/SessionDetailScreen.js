import React, { useEffect,useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BluetoothRecordingScreen from './BluetoothRecordingScreen';
export default function SessionDetailScreen({ session, onSetPress, onDeleteSet, onRenameSet, onBack, connectedDevice, onAddSet}) {

  const [sets, setSets] = useState(session.sets || []);

  const promptRename = (setId) => {
    Alert.prompt('Rename Set', 'Enter new exercise name:', (text) => {
      if (text.trim()) onRenameSet(setId, text);
    });
  };

  useEffect(() => {
    setSets(session.sets || []);
  }, [session]);

  const handleNewSet = (newSet) => {
    if (onAddSet) onAddSet(newSet);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{session.name}</Text>
      <FlatList
        data={session.sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.setCard}>
            <TouchableOpacity onPress={() => onSetPress(item)} style={{ flex: 1 }}>
              <Text style={styles.exercise}>{item.exercise}</Text>
              <Text style={styles.info}>
                Reps: {item.reps} | Tempo: {item.tempo} | Duration: {item.duration}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => promptRename(item.id)}>
              <Text style={styles.btn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDeleteSet(item.id)}>
              <Text style={styles.btn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <BluetoothRecordingScreen
        device={connectedDevice}
        onDisconnect={() => {}}
        onNewSet={handleNewSet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  back: { color: '#007AFF', marginBottom: 10 },
  setCard: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exercise: { fontWeight: 'bold' },
  info: { marginTop: 4 },
  btn: { fontSize: 16 },
});
