// src/components/SessionCard.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '../context/NavigationContext';
import { useUserSessions } from '../hooks/useUserSessions';
import { Menu, IconButton } from 'react-native-paper';

export default function SessionCard({ item }) {
  const { deleteSession, updateSession } = useUserSessions();
  const { setView, setSelectedSessionId } = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newSessionName, setNewSessionName] = useState(item.name || '');

  const goToSession = () => {
    setSelectedSessionId(item.id);
    setView('SessionDetail');
  };

  const handleDelete = () => {
    Alert.alert('Delete Session', 'Are you sure you want to delete this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSession(item.id);
            setView('');
            setTimeout(() => setView('Home'), 10);
          } catch (err) {
            Alert.alert('Error', 'Failed to delete session.');
            console.error('Delete error:', err);
          }
        },
      },
    ]);
  };

  const handleRename = async () => {
    if (!newSessionName.trim()) return;
    try {
      await updateSession(item.id, { name: newSessionName.trim() });
      setShowRenameModal(false);
      setView('');
      setTimeout(() => setView('Home'), 10);
    } catch (err) {
      Alert.alert('Error', 'Failed to rename session.');
      console.error('Rename error:', err);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={goToSession}>
        <Text style={styles.name}>{item.name || 'Unnamed Session'}</Text>
        <Text style={styles.details}>{item.date || ''}</Text>
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
            <Text style={styles.modalTitle}>Rename Session</Text>
            <TextInput
              style={styles.modalInput}
              value={newSessionName}
              onChangeText={setNewSessionName}
              placeholder="Enter new name"
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
  name: {
    fontSize: 18,
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
