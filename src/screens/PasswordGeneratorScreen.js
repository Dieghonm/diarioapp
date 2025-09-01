import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Clipboard,
} from 'react-native';
import { generatePassword, passwordTypes, createPasswordEntry } from '../utils/PasswordUtils';
import { saveSettings, loadSettings } from '../services/StorageService';

const PasswordGeneratorScreen = ({ savedPasswords, setSavedPasswords }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordType, setPasswordType] = useState('numbers');
  const [passwordLength, setPasswordLength] = useState(6);

  useEffect(() => {
    loadStoredSettings();
  }, []);

  const loadStoredSettings = async () => {
    try {
      const settings = await loadSettings();
      setPasswordType(settings.passwordType);
      setPasswordLength(settings.passwordLength);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveCurrentSettings = async (type, length) => {
    try {
      await saveSettings({
        passwordType: type,
        passwordLength: length
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const handleTypeChange = (newType) => {
    setPasswordType(newType);
    saveCurrentSettings(newType, passwordLength);
  };

  const handleLengthChange = (newLength) => {
    setPasswordLength(newLength);
    saveCurrentSettings(passwordType, newLength);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(passwordLength, passwordType);
    setCurrentPassword(newPassword);
    
    // Criar entrada de senha
    const passwordEntry = createPasswordEntry(
      newPassword, 
      passwordType, 
      passwordLength, 
      passwordTypes
    );
    
    // Atualizar lista de senhas (manter apenas as últimas 5)
    const updatedPasswords = [passwordEntry, ...savedPasswords].slice(0, 5);
    setSavedPasswords(updatedPasswords);
  };

  const copyToClipboard = () => {
    if (currentPassword) {
      Clipboard.setString(currentPassword);
      Alert.alert('Sucesso', 'Senha copiada para a área de transferência!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Gerador de Senhas</Text>
        
        <View style={styles.passwordDisplay}>
          <Text style={styles.passwordText}>
            {currentPassword || 'Clique em "Gerar Senha" para começar'}
          </Text>
          {currentPassword && (
            <TouchableOpacity 
              style={styles.copyButton} 
              onPress={copyToClipboard}
            >
              <Text style={styles.copyButtonText}>Copiar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Tipo de senha:</Text>
          <View style={styles.pickerContainer}>
            {passwordTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeOption,
                  passwordType === type.key && styles.typeOptionActive
                ]}
                onPress={() => handleTypeChange(type.key)}
              >
                <Text style={[
                  styles.typeOptionText,
                  passwordType === type.key && styles.typeOptionTextActive
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Número de caracteres: {passwordLength}</Text>
          <View style={styles.lengthContainer}>
            <View style={styles.lengthControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handleLengthChange(Math.max(4, passwordLength - 1))}
              >
                <Text style={styles.controlButtonText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.lengthDisplay}>{passwordLength}</Text>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handleLengthChange(Math.min(20, passwordLength + 1))}
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.quickButtons}>
              {[4, 6, 8, 10, 12].map((length) => (
                <TouchableOpacity
                  key={length}
                  style={[
                    styles.quickButton,
                    passwordLength === length && styles.quickButtonActive
                  ]}
                  onPress={() => handleLengthChange(length)}
                >
                  <Text style={[
                    styles.quickButtonText,
                    passwordLength === length && styles.quickButtonTextActive
                  ]}>
                    {length}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGeneratePassword}
        >
          <Text style={styles.generateButtonText}>Gerar Senha</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  passwordDisplay: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passwordText: {
    fontSize: 18,
    fontFamily: 'monospace',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectorContainer: {
    marginBottom: 25,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    minWidth: 120,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  typeOptionTextActive: {
    color: '#FFF',
  },
  lengthContainer: {
    alignItems: 'center',
  },
  lengthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  controlButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  lengthDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 25,
    minWidth: 40,
    textAlign: 'center',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickButtonActive: {
    backgroundColor: '#E6F2FF',
    borderColor: '#007AFF',
  },
  quickButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  quickButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PasswordGeneratorScreen;