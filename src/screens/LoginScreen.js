import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { COLORS, globalStyles } from '../styles/theme';
import { verifyPassword } from '../services/storage';
import Toast from '../components/Toast';

import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [error, setError] = useState('');
  const shakeAnimation = new Animated.Value(0);


  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');
    const isValid = await verifyPassword(password);

    if (isValid) {
      showToast('Bem-vindo de volta!', 'success');
      setTimeout(() => onLogin(), 500);
    } else {
      setError('Senha incorreta');
      showToast('Senha incorreta. Tente novamente.', 'error');
      setPassword('');
      shakeInput();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={globalStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.lockIcon}>
              <Text style={styles.lockEmoji}>🔒</Text>
            </View>

            <Text style={styles.title}>Meu Diário</Text>
            <Text style={styles.subtitle}>Digite sua senha para continuar</Text>

            <View style={styles.passwordContainer}>
              <Animated.View
                style={[
                  styles.inputWrapper,
                  { transform: [{ translateX: shakeAnimation }] },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, error && styles.passwordInputError]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  placeholder="••••"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  placeholderTextColor="#999"
                  autoFocus
                />
              </Animated.View>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                password.length === 4 && styles.loginButtonActive,
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={password.length < 4}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-7575632514010930/6690761032'}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(err) => console.log('Erro ao carregar banner:', err)}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  lockEmoji: { fontSize: 50 },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMedium,
    marginBottom: 40,
    textAlign: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputWrapper: { width: 220 },
  passwordInput: {
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
  passwordInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  errorContainer: {
    marginTop: 10,
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 15,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    opacity: 0.6,
  },
  loginButtonActive: {
    backgroundColor: COLORS.primaryDark,
    opacity: 1,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
