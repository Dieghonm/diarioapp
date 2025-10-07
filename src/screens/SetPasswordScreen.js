import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS, globalStyles } from '../styles/theme';
import { savePassword } from '../services/storage';

const SetPasswordScreen = ({ onPasswordSet }) => {
  const [password, setPassword] = useState('');

  const handleSetPassword = async () => {
    if (password.length < 4) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 4 dígitos');
      return;
    }

    const success = await savePassword(password);
    if (success) {
      Alert.alert('✅ Sucesso!', 'Senha criada com sucesso!', [
        { text: 'OK', onPress: onPasswordSet }
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível criar a senha');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={globalStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.lockIcon}>
              <Text style={styles.lockEmoji}>🔐</Text>
            </View>
            
            <Text style={styles.title}>Bem-vindo ao Diário!</Text>
            <Text style={styles.subtitle}>
              Crie uma senha de 4 dígitos para proteger seu diário
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Digite sua senha</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                placeholderTextColor="#999"
                autoFocus
              />
            </View>
            <TouchableOpacity
              style={[
                styles.button,
              ]}
              onPress={handleSetPassword}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Criar Senha</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  lockIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightPink,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMedium,
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMedium,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 70,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 32,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    letterSpacing: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonActive: {
    backgroundColor: COLORS.primaryDark,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SetPasswordScreen;