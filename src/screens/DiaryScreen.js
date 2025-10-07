import React, { useState, useEffect } from 'react';
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
  ScrollView,
  Keyboard,
} from 'react-native';
import { COLORS, globalStyles } from '../styles/theme';
import { addEntry, getEntries } from '../services/storage';
import { getCurrentDate, formatDate } from '../utils/dateUtils';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import ColorPicker from '../components/ColorPicker';
import EntryCard from '../components/EntryCard';
import { deleteEntry } from '../services/storage';

const DiaryScreen = () => {
  const [date, setDate] = useState(getCurrentDate());
  const [theme, setTheme] = useState('');
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('pink');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  const handleSaveEntry = async () => {
    if (!date.trim() || !text.trim()) {
      Alert.alert('Atenção', 'Preencha a data e o texto');
      return;
    }

    const entry = {
      date: date.trim(),
      theme: theme.trim(),
      text: text.trim(),
      bgColor,
    };

    const newEntry = await addEntry(entry);
    
    if (newEntry) {
      await loadEntries();
      setDate(getCurrentDate());
      setTheme('');
      setText('');
      setBgColor('pink');
      Keyboard.dismiss();
      Alert.alert('✅ Sucesso!', 'Entrada salva com sucesso!');
    } else {
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
            const success = await deleteEntry(id);
            if (success) {
              await loadEntries();
            } else {
              Alert.alert('Erro', 'Não foi possível excluir a entrada');
            }
          }
        }
      ]
    );
  };

  const handleSelectDate = (selectedDate) => {
    setDate(formatDate(selectedDate));
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Header 
        title="📔 Querido Diário" 
        subtitle={`${entries.length} ${entries.length === 1 ? 'entrada' : 'entradas'}`}
      />
      
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Calendário */}
          <View style={styles.section}>
            <Calendar entries={entries} onSelectDate={handleSelectDate} />
          </View>

          {/* Formulário de Nova Entrada */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>✍️ Nova Entrada</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="Ex: 07/10/2025"
                placeholderTextColor="#999"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tema (opcional)</Text>
              <TextInput
                style={styles.input}
                value={theme}
                onChangeText={setTheme}
                placeholder="Ex: Um dia especial"
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

            <ColorPicker selectedColor={bgColor} onSelectColor={setBgColor} />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEntry}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>💾 Salvar Entrada</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Entradas */}
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
              entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={() => handleDeleteEntry(entry.id)}
                />
              ))
            )}
          </View>
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    padding: 15,
    paddingTop: 20,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    margin: 15,
    marginTop: 0,
    borderRadius: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.lightPink,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMedium,
    marginBottom: 8,
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
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  entriesContainer: {
    padding: 15,
    paddingTop: 10,
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
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: COLORS.textVeryLight,
    fontSize: 14,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default DiaryScreen;