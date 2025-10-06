import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadEntries();
    }
  }, [isAuthenticated]);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('diaryEntries');
      if (stored) {
        const parsed = JSON.parse(stored);
        const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(sorted);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as entradas');
    }
  };

  const handleLogin = () => {
    if (password === '2909') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      Alert.alert('Erro', 'Senha incorreta!');
      setPassword('');
    }
  };

  const handleSaveEntry = async () => {
    if (!date.trim() || !text.trim()) {
      Alert.alert('Atenção', 'Preencha a data e o texto');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      date: date.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedEntries = [...entries, newEntry].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    try {
      await AsyncStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      setDate('');
      setText('');
      Keyboard.dismiss();
      Alert.alert('✅ Sucesso!', 'Entrada salva com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a entrada');
    }
  };

  const handleDeleteEntry = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir esta entrada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedEntries = entries.filter(entry => entry.id !== id);
            try {
              await AsyncStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
              setEntries(updatedEntries);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a entrada');
            }
          }
        }
      ]
    );
  };

  const renderEntry = ({ item }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>📅 {item.date}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteEntry(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.entryText}>{item.text}</Text>
    </View>
  );

  // Tela de Login
  if (!isAuthenticated) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFF0F5" />
          <KeyboardAvoidingView 
            style={styles.loginContainer} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.loginBox}>
              <View style={styles.lockIcon}>
                <Text style={styles.lockEmoji}>🔒</Text>
              </View>
              <Text style={styles.title}>Meu Diário</Text>
              <Text style={styles.subtitle}>Digite a senha de 4 dígitos</Text>
              
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
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
                style={[styles.loginButton, password.length === 4 && styles.loginButtonActive]} 
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }

  // Tela do Diário
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E91E8C" />
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📔 Meu Diário</Text>
          <Text style={styles.headerSubtitle}>
            {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'}
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>✍️ Nova Entrada</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="Ex: 06/10/2025"
                placeholderTextColor="#999"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Como foi seu dia?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={text}
                onChangeText={setText}
                placeholder="Escreva sobre seu dia, seus sentimentos, pensamentos..."
                multiline
                numberOfLines={6}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveEntry}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>💾 Salvar Entrada</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.entriesContainer}>
            <Text style={styles.sectionTitle}>📚 Suas Entradas</Text>
            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={styles.emptyText}>Nenhuma entrada ainda</Text>
                <Text style={styles.emptySubtext}>
                  Comece a escrever seu diário acima!
                </Text>
              </View>
            ) : (
              <FlatList
                data={entries}
                renderItem={renderEntry}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  flex: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loginBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  lockIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE4F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#C84B85',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#9E6B8A',
    marginBottom: 40,
    textAlign: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  passwordInput: {
    width: 220,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 32,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#F4C8DD',
    letterSpacing: 10,
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#E91E8C',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 15,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonActive: {
    backgroundColor: '#D01B7D',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#E91E8C',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFE4F1',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFE4F1',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C84B85',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9E6B8A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF8FC',
    borderWidth: 1,
    borderColor: '#F4C8DD',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#D946A7',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#D946A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  entriesContainer: {
    padding: 15,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#C084A1',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#D4A5BD',
    fontSize: 14,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFF0F5',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E91E8C',
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 22,
  },
  entryText: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 30,
  },
});