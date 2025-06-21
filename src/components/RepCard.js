// src/components/RepCard.js

import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import { IconButton } from 'react-native-paper';

export default function RepCard({ item, index }) {
  const { selectedSet, selectedSessionId, setView } = useNavigation();
  const { updateRep, deleteRep } = useUserSessions();

  const { id: repId, duration, rom, tempo, rpe } = item;

  const handleRpeChange = (value) => {
    const newRpe = parseInt(value, 10) || '';
    updateRep(selectedSessionId, selectedSet.id, repId, { rpe: newRpe });
  };

  const handleDeleteRep = () => {
    deleteRep(selectedSessionId, selectedSet.id, repId);
    setView('Home');
    setTimeout(() => setView('SetDetail'), 100);
  };

  return (
    <View style={styles.repCard}>
      <View style={styles.headerRow}>
        <Text style={styles.repHeader}>Rep {index + 1}</Text>
        <IconButton
          icon="trash-can"
          iconColor="#e74c3c"
          size={20}
          onPress={handleDeleteRep}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            defaultValue={duration}
            placeholder="0.00s"
            placeholderTextColor="#777"
            onEndEditing={(e) =>
              updateRep(selectedSessionId, selectedSet.id, repId, {
                duration: e.nativeEvent.text,
              })
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ROM</Text>
          <TextInput
            style={styles.input}
            defaultValue={rom}
            placeholder="ROM"
            placeholderTextColor="#777"
            onEndEditing={(e) =>
              updateRep(selectedSessionId, selectedSet.id, repId, {
                rom: e.nativeEvent.text,
              })
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tempo</Text>
          <TextInput
            style={styles.input}
            defaultValue={tempo}
            placeholder="Tempo"
            placeholderTextColor="#777"
            onEndEditing={(e) =>
              updateRep(selectedSessionId, selectedSet.id, repId, {
                tempo: e.nativeEvent.text,
              })
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>RPE</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            defaultValue={rpe?.toString() || ''}
            placeholder="RPE"
            placeholderTextColor="#777"
            onEndEditing={(e) => handleRpeChange(e.nativeEvent.text)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  repCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  repHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputGroup: {
    width: '48%',
    marginBottom: 12,
  },
  label: {
    color: '#aaa',
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
});
