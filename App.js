import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PasswordGeneratorScreen from './src/screens/PasswordGeneratorScreen';
import SavedPasswordsScreen from './src/screens/SavedPasswordsScreen';
import { loadPasswords, savePasswords } from './src/services/StorageService';

const Tab = createBottomTabNavigator();

const App = () => {
  const [savedPasswords, setSavedPasswords] = useState([0,0,0,0,0,0]);

  useEffect(() => {
    loadStoredPasswords();
  }, []);

  const loadStoredPasswords = async () => {
    try {
      const passwords = await loadPasswords();
      setSavedPasswords(passwords);
    } catch (error) {
      console.error('Erro ao carregar senhas:', error);
    }
  };

  const updateSavedPasswords = async (newPasswords) => {
    try {
      setSavedPasswords(newPasswords);
      await savePasswords(newPasswords);
    } catch (error) {
      console.error('Erro ao salvar senhas:', error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
          },
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Gerar"
          options={{
            tabBarLabel: 'Gerar Senha',
          }}
        >
          {() => (
            <PasswordGeneratorScreen 
              savedPasswords={savedPasswords}
              setSavedPasswords={updateSavedPasswords}
            />
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="Histórico"
          options={{
            tabBarLabel: 'Senhas Salvas',
          }}
        >
          {() => <SavedPasswordsScreen savedPasswords={savedPasswords} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;