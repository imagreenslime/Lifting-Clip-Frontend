// src/components/SetCard.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Pressable } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import { useUserLifts } from '../hooks/useUserLifts';
import { Menu, IconButton } from 'react-native-paper';

export default function SetCard({ item }) {
  const { deleteSet, updateSet } = useUserSessions();
  const { setSelectedSet, setView, selectedSessionId } = useNavigation();
  const { lifts } = useUserLifts();
  const [menuVisible, setMenuVisible] = useState(false);
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
    if (!newLiftType || !newExerciseName.trim()) return;
    try {
      await updateSet(selectedSessionId, item.id, {
        liftType: newLiftType,
        exercise: newExerciseName.trim(),
      });
      setShowRenameModal(false);
      setSelectedSet(item);
      setView('');
      setTimeout(() => setView('SessionDetail'), 10);
    } catch (err) {
      Alert.alert('Error', 'Failed to rename set.');
      console.error('Rename error:', err);
    }
  };

  const repValues = item.repdata ? Object.values(item.repdata) : [];

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={goToSet}>
        <Text style={styles.exercise}>
          {item.exercise} {item.liftType ? `(${item.liftType})` : ''}
        </Text>
        <Text style={styles.details}>
          Reps: {repValues.length} | Duration: {item.duration} | RPE: {item.totalRpe}
        </Text>
      </TouchableOpacity>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<IconButton icon="dots-vertical" iconColor="white" size={24} onPress={() => setMenuVisible(true)} />}
        contentStyle={{ backgroundColor: '#333' }}
      >
        <Menu.Item
          onPress={() => {
            setShowRenameModal(true);
            setMenuVisible(false);
          }}
          title="Rename"
          titleStyle={{ color: 'white' }}
        />
        <Menu.Item
          onPress={() => {
            handleDelete();
            setMenuVisible(false);
          }}
          title="Delete"
          titleStyle={{ color: '#e74c3c' }}
        />
      </Menu>

      {/* Rename Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Set</Text>

            <Text style={styles.modalLabel}>Select Lift Type:</Text>
            <View style={styles.liftTypeRow}>
              {lifts.map((lift) => (
                <Pressable
                  key={lift.id}
                  style={[styles.liftTypeButton, newLiftType === lift.name && styles.liftTypeSelected]}
                  onPress={() => setNewLiftType(lift.name)}
                >
                  <Text style={{ color: newLiftType === lift.name ? '#fff' : '#000' }}>
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
              placeholderTextColor="#777"
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
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  cardContent: {
    flex: 1,
  },
  exercise: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  details: {
    color: '#aaa',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    padding: 24,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 10,
    color: '#fff',
  },
  liftTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liftTypeButton: {
    padding: 8,
    margin: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  liftTypeSelected: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    padding: 10,
    color: '#fff',
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
