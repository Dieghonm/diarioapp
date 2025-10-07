import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, PASTEL_COLORS } from '../styles/theme';

const EntryCard = ({ entry, onDelete }) => {
  const backgroundColor = PASTEL_COLORS.find(c => c.id === entry.bgColor)?.color || COLORS.white;

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.date}>📅 {entry.date}</Text>
          {entry.theme && (
            <Text style={styles.theme}>{entry.theme}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.text}>{entry.text}</Text>
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
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 22,
  },
  text: {
    fontSize: 16,
    color: COLORS.textDark,
    lineHeight: 24,
  },
});

export default EntryCard;