import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Clipboard,
} from 'react-native';

const SavedPasswordsScreen = ({ savedPasswords }) => {
  const copyPassword = (password) => {
    Clipboard.setString(password);
    Alert.alert('Sucesso', 'Senha copiada para a área de transferência!');
  };

  const renderPasswordItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.passwordItem}
      onPress={() => copyPassword(item.password)}
    >
      <View style={styles.passwordHeader}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.savedPasswordText}>{item.password}</Text>
      <Text style={styles.passwordTypeText}>Tipo: {item.type} • {item.length} caracteres</Text>
      <Text style={styles.tapToCopyText}>Toque para copiar</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Senhas Geradas</Text>
        <Text style={styles.subtitle}>Últimas 5 senhas geradas</Text>
        
        {savedPasswords.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhuma senha gerada ainda</Text>
            <Text style={styles.emptySubtext}>
              Vá para a aba "Gerar Senha" para criar sua primeira senha
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedPasswords}
            renderItem={renderPasswordItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
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
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  passwordItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 3,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  savedPasswordText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#333',
    marginBottom: 5,
  },
  passwordTypeText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
  },
  tapToCopyText: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default SavedPasswordsScreen;