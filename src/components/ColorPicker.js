// src/components/ColorPicker.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PASTEL_COLORS, COLORS } from '../styles/theme';

const ColorPicker = ({ selectedColor, onSelectColor }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cor do Fundo</Text>
      <View style={styles.colorsContainer}>
        {PASTEL_COLORS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.colorButton,
              { backgroundColor: item.color },
              selectedColor === item.id && styles.selectedColor
            ]}
            onPress={() => onSelectColor(item.id)}
            activeOpacity={0.7}
          >
            {selectedColor === item.id && (
              <Text style={styles.checkMark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMedium,
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  checkMark: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default ColorPicker;