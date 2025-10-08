import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, PASTEL_COLORS } from '../styles/theme';

const EntryCard = ({ entry, onDelete, onEdit, isEditing }) => {
  const backgroundColor = PASTEL_COLORS.find(c => c.id === entry.bgColor)?.color || COLORS.white;

  return (
    <View style={[
      styles.card, 
      { backgroundColor },
      isEditing && styles.cardEditing
    ]}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.date}>📅 {entry.date}</Text>
          {entry.theme && (
            <Text style={styles.theme}>{entry.theme}</Text>
          )}
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEdit}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.text}>{entry.text}</Text>
      
      {isEditing && (
        <View style={styles.editingBadge}>
          <Text style={styles.editingBadgeText}>✏️ Editando</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardEditing: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  theme: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
  },
  deleteButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    color: COLORS.textDark,
    lineHeight: 24,
  },
  editingBadge: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editingBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default EntryCard;