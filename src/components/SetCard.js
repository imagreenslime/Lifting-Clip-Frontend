// src/components/SetCard.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Pressable } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import { useUserLifts } from '../hooks/useUserLifts';

export default function SetCard({ item }) {
  const { deleteSet, updateSet } = useUserSessions();
  const { setSelectedSet, setView, selectedSessionId } = useNavigation();
  const { lifts } = useUserLifts();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newLiftType, setNewLiftType] = useState(item.liftType || '');
  const [newExerciseName, setNewExerciseName] = useState(item.exercise || '');

  const goToSet = () => {
    setSelectedSet(item);
    setView('SetDetail');
  };

  const handleDelete = () => {
    Alert.alert('Delete Set', 'Are you sure you want to delete this set?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSet(selectedSessionId, item.id);
            setView('');
            setTimeout(() => setView('SessionDetail'), 10);
          } catch (err) {
            Alert.alert('Error', 'Failed to delete set.');
            console.error('Delete error:', err);
          }
        },
      },
    ]);
  };

  const handleRename = async () => {
    if (!newLiftType || !newExerciseName.trim()) {
      Alert.alert('Missing fields', 'Please select a lift type and enter a name.');
      return;
    }
    try {
      await updateSet(selectedSessionId, item.id, {
        liftType: newLiftType,
        exercise: newExerciseName.trim(),
      });
      setShowRenameModal(false);
      setView('');
      setTimeout(() => setView('SessionDetail'), 10);
    } catch (err) {
      Alert.alert('Error', 'Failed to rename set.');
      console.error('Rename error:', err);
    }
  };


  const repValues = item.repdata ? Object.values(item.repdata) : [];

  return (
    <View style={styles.setCard}>
      <TouchableOpacity onPress={goToSet} style={{ flex: 1 }}>
        <Text style={styles.exercise}>
          {item.exercise} {item.liftType ? `(${item.liftType})` : ''}
        </Text>
        <Text style={styles.info}>
          Reps: {repValues.length} | Duration: {item.duration} | RPE: {item.totalRpe}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowRenameModal(true)}>
        <Text style={styles.btn}>✏️</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete}>
        <Text style={styles.btn}>🗑</Text>
      </TouchableOpacity>

      {/* Rename Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Set</Text>

            <Text style={styles.modalLabel}>Select Lift Type:</Text>
            <View style={styles.liftTypeRow}>
              {lifts.map(lift => (
                <Pressable
                  key={lift.id}
                  style={[
                    styles.liftTypeButton,
                    newLiftType === lift.name && styles.liftTypeSelected,
                  ]}
                  onPress={() => setNewLiftType(lift.name)}
                >
                  <Text
                    style={{
                      color: newLiftType === lift.name ? '#fff' : '#000',
                    }}
                  >
                    {lift.name.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.modalLabel}>Nickname:</Text>
            <TextInput
              style={styles.modalInput}
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              placeholder="Enter nickname"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleRename}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setShowRenameModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 10,
  },
  liftTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liftTypeButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
  },
  liftTypeSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
