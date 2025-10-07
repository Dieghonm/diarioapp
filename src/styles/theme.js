// src/styles/theme.js
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#E91E8C',
  primaryDark: '#D01B7D',
  secondary: '#C84B85',
  accent: '#D946A7',
  
  background: '#FFF0F5',
  white: '#FFFFFF',
  
  border: '#F4C8DD',
  lightPink: '#FFE4F1',
  textDark: '#4A4A4A',
  textMedium: '#9E6B8A',
  textLight: '#C084A1',
  textVeryLight: '#D4A5BD',
  
  // Cores pastéis para fundo das entradas
  pastel: {
    pink: '#FFE4E1',
    blue: '#E0F2F7',
    green: '#E0F8E0',
    lavender: '#F0E6FF',
    peach: '#FFE5CC',
  }
};

export const PASTEL_COLORS = [
  { id: 'pink', color: COLORS.pastel.pink, name: 'Rosa' },
  { id: 'blue', color: COLORS.pastel.blue, name: 'Azul' },
  { id: 'green', color: COLORS.pastel.green, name: 'Verde' },
  { id: 'lavender', color: COLORS.pastel.lavender, name: 'Lavanda' },
  { id: 'peach', color: COLORS.pastel.peach, name: 'Pêssego' },
];

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  shadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  shadowStrong: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  input: {
    backgroundColor: '#FFF8FC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: COLORS.textDark,
  },
  
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.lightPink,
  },
});