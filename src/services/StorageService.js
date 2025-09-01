import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@KeyGen:passwords';
const SETTINGS_KEY = '@KeyGen:settings';

// Funções para senhas
export const savePasswords = async (passwords) => {
  try {
    const jsonValue = JSON.stringify(passwords);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar senhas:', error);
    throw error;
  }
};

export const loadPasswords = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar senhas:', error);
    return [];
  }
};

// Funções para configurações (tipo e tamanho da senha)
export const saveSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    throw error;
  }
};

export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      passwordType: 'numbers',
      passwordLength: 6
    };
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    return {
      passwordType: 'numbers',
      passwordLength: 6
    };
  }
};

// Função para limpar todos os dados (útil para debug)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEY, SETTINGS_KEY]);
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    throw error;
  }
};