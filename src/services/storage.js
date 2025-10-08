// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// ========== PASSWORD ==========
export const savePassword = async (password) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PASSWORD, password);
    return true;
  } catch (error) {
    console.error('Erro ao salvar senha:', error);
    return false;
  }
};

export const getPassword = async () => {
  try {
    const password = await AsyncStorage.getItem(STORAGE_KEYS.PASSWORD);
    return password;
  } catch (error) {
    console.error('Erro ao buscar senha:', error);
    return null;
  }
};

export const verifyPassword = async (inputPassword) => {
  try {
    const storedPassword = await getPassword();
    return storedPassword === inputPassword;
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
};

// ========== ENTRIES ==========
export const saveEntries = async (entries) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Erro ao salvar entradas:', error);
    return false;
  }
};

export const getEntries = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar entradas:', error);
    return [];
  }
};

export const addEntry = async (entry) => {
  try {
    const entries = await getEntries();
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      createdAt: new Date().toISOString()
    };
    const updatedEntries = [newEntry, ...entries];
    await saveEntries(updatedEntries);
    return newEntry;
  } catch (error) {
    console.error('Erro ao adicionar entrada:', error);
    return null;
  }
};

export const updateEntry = async (id, updatedData) => {
  try {
    const entries = await getEntries();
    const updatedEntries = entries.map(entry => 
      entry.id === id 
        ? { ...entry, ...updatedData, updatedAt: new Date().toISOString() }
        : entry
    );
    await saveEntries(updatedEntries);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar entrada:', error);
    return false;
  }
};

export const deleteEntry = async (id) => {
  try {
    const entries = await getEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    await saveEntries(updatedEntries);
    return true;
  } catch (error) {
    console.error('Erro ao deletar entrada:', error);
    return false;
  }
};

export const getEntriesByMonth = async (month, year) => {
  try {
    const entries = await getEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.getMonth() === month && entryDate.getFullYear() === year;
    });
  } catch (error) {
    console.error('Erro ao buscar entradas do mês:', error);
    return [];
  }
};