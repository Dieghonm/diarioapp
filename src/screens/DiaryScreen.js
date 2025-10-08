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
import { addEntry, getEntries, updateEntry } from '../services/storage';
import { getCurrentDate, formatDate, parseDate, normalizeDate } from '../utils/dateUtils';
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
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, selectedDate, selectedMonth]);

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  const filterEntries = () => {
    let filtered = [...entries];

    if (selectedDate) {
      filtered = filtered.filter(entry => {
        const entryDate = parseDate(entry.date);
        return entryDate && 
               entryDate.getDate() === selectedDate.getDate() &&
               entryDate.getMonth() === selectedDate.getMonth() &&
               entryDate.getFullYear() === selectedDate.getFullYear();
      });
    } else if (selectedMonth) {
      filtered = filtered.filter(entry => {
        const entryDate = parseDate(entry.date);
        return entryDate &&
               entryDate.getMonth() === selectedMonth.month &&
               entryDate.getFullYear() === selectedMonth.year;
      });
    }

    filtered.sort((a, b) => {
      const dateA = parseDate(a.date) || new Date(a.createdAt);
      const dateB = parseDate(b.date) || new Date(b.createdAt);
      return dateB - dateA;
    });

    setFilteredEntries(filtered);
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

    if (editingEntry) {
      const success = await updateEntry(editingEntry.id, entry);
      if (success) {
        await loadEntries();
        clearForm();
        Keyboard.dismiss();
        Alert.alert('✅ Sucesso!', 'Entrada atualizada com sucesso!');
        setActiveTab('list');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a entrada');
      }
    } else {
      const newEntry = await addEntry(entry);
      if (newEntry) {
        await loadEntries();
        clearForm();
        Keyboard.dismiss();
        Alert.alert('✅ Sucesso!', 'Entrada salva com sucesso!');
        setActiveTab('list');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar a entrada');
      }
    }
  };

  const clearForm = () => {
    setDate(getCurrentDate());
    setTheme('');
    setText('');
    setBgColor('pink');
    setEditingEntry(null);
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
              if (editingEntry && editingEntry.id === id) {
                clearForm();
              }
              Alert.alert('✅ Sucesso', 'Entrada excluída!');
            } else {
              Alert.alert('Erro', 'Não foi possível excluir a entrada');
            }
          }
        }
      ]
    );
  };

  const handleEditEntry = (entry) => {
    setDate(entry.date);
    setTheme(entry.theme || '');
    setText(entry.text);
    setBgColor(entry.bgColor);
    setEditingEntry(entry);
    setActiveTab('form');
    Alert.alert('✏️ Modo de Edição', 'Edite a entrada e clique em "Atualizar Entrada"');
  };

  const handleSelectDate = (selectedDate) => {
    setDate(formatDate(selectedDate));
    setSelectedDate(selectedDate);
    setSelectedMonth(null);
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth({ month, year });
    setSelectedDate(null);
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedMonth(null);
  };

  const getFilterText = () => {
    if (selectedDate) {
      return `Mostrando entradas de ${formatDate(selectedDate)}`;
    }
    if (selectedMonth) {
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return `Mostrando entradas de ${months[selectedMonth.month]} ${selectedMonth.year}`;
    }
    return 'Mostrando todas as entradas';
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Header 
        title="📔 Querido Diário" 
        subtitle={`${entries.length} ${entries.length === 1 ? 'entrada' : 'entradas'}`}
      />
      
      {/* Abas de Navegação */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'form' && styles.activeTab]}
          onPress={() => setActiveTab('form')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'form' && styles.activeTabText]}>
            ✍️ {editingEntry ? 'Editar' : 'Escrever'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            📚 Minhas anotações
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Calendar 
              entries={entries} 
              onSelectDate={handleSelectDate}
              onMonthChange={handleMonthChange}
            />
          </View>

          {activeTab === 'form' && (
            <View style={styles.formContainer}>
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

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEntry}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>
                    {editingEntry ? '💾 Atualizar anotação' : '💾 Salvar anotação'}
                  </Text>
                </TouchableOpacity>

                {editingEntry && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      clearForm();
                      setActiveTab('list');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Lista de Entradas */}
          {activeTab === 'list' && (
            <View style={styles.entriesContainer}>
              <View style={styles.entriesHeader}>
                <Text style={styles.sectionTitle}>📚 Suas anotações</Text>
                {(selectedDate || selectedMonth) && (
                  <TouchableOpacity 
                    style={styles.clearFilterButton}
                    onPress={clearFilters}
                  >
                    <Text style={styles.clearFilterText}>Mostrar Todas</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.filterInfo}>{getFilterText()}</Text>
              
              {filteredEntries.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>📝</Text>
                  <Text style={styles.emptyText}>
                    {(selectedDate || selectedMonth) 
                      ? 'Nenhuma anotação neste período' 
                      : 'Nenhuma anotação ainda'}
                  </Text>
                  <Text style={styles.emptySubtext}>
                    {(selectedDate || selectedMonth)
                      ? 'Tente selecionar outro período'
                      : 'Clique em "Escrever" para começar!'}
                  </Text>
                </View>
              ) : (
                filteredEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={() => handleDeleteEntry(entry.id)}
                    onEdit={() => handleEditEntry(entry)}
                    isEditing={editingEntry && editingEntry.id === entry.id}
                  />
                ))
              )}
            </View>
          )}
          
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightPink,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
    backgroundColor: COLORS.lightPink,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
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
  buttonContainer: {
    gap: 10,
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
  cancelButton: {
    backgroundColor: COLORS.textLight,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  entriesContainer: {
    padding: 15,
    paddingTop: 10,
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearFilterButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearFilterText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterInfo: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginBottom: 15,
    fontStyle: 'italic',
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