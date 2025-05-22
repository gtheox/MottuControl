import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Configuracoes() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const jsonValue = await AsyncStorage.getItem('@settings');
        if (jsonValue != null) {
          setNotificationsEnabled(JSON.parse(jsonValue).notificationsEnabled);
        }
      } catch (e) {
        console.log('Erro ao carregar configurações', e);
      }
    }
    loadSettings();
  }, []);

  const toggleSwitch = async () => {
    try {
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);
      await AsyncStorage.setItem('@settings', JSON.stringify({ notificationsEnabled: newValue }));
    } catch (e) {
      console.log('Erro ao salvar configurações', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <View style={styles.row}>
        <Text>Notificações</Text>
        <Switch onValueChange={toggleSwitch} value={notificationsEnabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  title: { fontSize: 24, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
