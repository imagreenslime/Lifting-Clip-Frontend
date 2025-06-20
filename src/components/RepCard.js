import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';

export default function RepCard({ item, index }) {
  const { selectedSet, selectedSessionId, setView} = useNavigation();
  const { updateRep, deleteRep, sessions } = useUserSessions();

  const { id: repId, duration, rom, tempo, rpe } = item;

  const handleRpeChange = (value) => {
    const newRpe = parseInt(value, 10) || '';
    updateRep(selectedSessionId, selectedSet.id, repId, { rpe: newRpe });
  };
  const handleDeleteRep = () => {
    deleteRep(selectedSessionId, selectedSet.id, repId);
    setView("Home");
    setTimeout(() => setView('SetDetail'), 100);
  }
  return (
    <View style={styles.repCard}>
      <Text style={styles.repHeader}>Rep {index + 1}</Text>

      <View style={styles.rpeRow}>
        <Text style={styles.rpeLabel}>Duration:</Text>
        <TextInput
          style={styles.repInput}
          defaultValue={duration}
          placeholder="0.00s"
          onEndEditing={(e) =>
            updateRep(selectedSessionId, selectedSet.id, repId, {
              duration: e.nativeEvent.text,
            })
          }
        />
      </View>

      <View style={styles.rpeRow}>
        <Text style={styles.rpeLabel}>ROM:</Text>
        <TextInput
          style={styles.repInput}
          defaultValue={rom}
          placeholder="ROM"
          onEndEditing={(e) =>
            updateRep(selectedSessionId, selectedSet.id, repId, {
              rom: e.nativeEvent.text,
            })
          }
        />
      </View>

      <View style={styles.rpeRow}>
        <Text style={styles.rpeLabel}>Tempo:</Text>
        <TextInput
          style={styles.repInput}
          defaultValue={tempo}
          placeholder="Tempo"
          onEndEditing={(e) =>
            updateRep(selectedSessionId, selectedSet.id, repId, {
              tempo: e.nativeEvent.text,
            })
          }
        />
      </View>

      <View style={styles.rpeRow}>
        <Text style={styles.rpeLabel}>RPE:</Text>
        <TextInput
          style={styles.repInput}
          keyboardType="numeric"
          defaultValue={rpe?.toString() || ''}
          placeholder="RPE"
          onEndEditing={(e) => handleRpeChange(e.nativeEvent.text)}
        />
      </View>
    <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDeleteRep}
    >
    <Text style={styles.deleteButtonText}>🗑 Delete Rep</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  repCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  repHeader: { fontWeight: 'bold', marginBottom: 4 },
  rpeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rpeLabel: { fontWeight: '500', marginRight: 8 },
  repInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 4,
    width: 50,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
});
