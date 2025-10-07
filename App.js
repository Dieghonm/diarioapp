// App.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getPassword } from './src/services/storage';
import { COLORS } from './src/styles/theme';
import SetPasswordScreen from './src/screens/SetPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import DiaryScreen from './src/screens/DiaryScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkPassword();
  }, []);

  const checkPassword = async () => {
    const password = await getPassword();
    setHasPassword(!!password);
    setIsLoading(false);
  };

  const handlePasswordSet = () => {
    setHasPassword(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Se não tem senha cadastrada, mostrar tela de criar senha
  if (!hasPassword) {
    return <SetPasswordScreen onPasswordSet={handlePasswordSet} />;
  }

  // Se não está autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Se está autenticado, mostrar o diário
  return <DiaryScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});