import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormularioMotos() {
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');

  useEffect(() => {
    // Carregar dados salvos
    async function loadForm() {
      try {
        const jsonValue = await AsyncStorage.getItem('@moto_form');
        if (jsonValue != null) {
          const saved = JSON.parse(jsonValue);
          setModelo(saved.modelo);
          setPlaca(saved.placa);
        }
      } catch (e) {
        console.log('Erro ao carregar dados do formulário', e);
      }
    }
    loadForm();
  }, []);

  const saveForm = async () => {
    try {
      const data = { modelo, placa };
      await AsyncStorage.setItem('@moto_form', JSON.stringify(data));
      Alert.alert('Sucesso', 'Dados salvos localmente!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar os dados');
    }
  };

  const clearForm = async () => {
    setModelo('');
    setPlaca('');
    await AsyncStorage.removeItem('@moto_form');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Moto</Text>

      <Text>Modelo:</Text>
      <TextInput
        style={styles.input}
        value={modelo}
        onChangeText={setModelo}
        placeholder="Digite o modelo da moto"
      />

      <Text>Placa:</Text>
      <TextInput
        style={styles.input}
        value={placa}
        onChangeText={setPlaca}
        placeholder="Digite a placa"
      />

      <Button title="Salvar" onPress={saveForm} />
      <Button title="Limpar" onPress={clearForm} color="red" />
      
      <View style={{ marginTop: 20 }}>
        <Text>Dados atuais:</Text>
        <Text>Modelo: {modelo}</Text>
        <Text>Placa: {placa}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  }
});
