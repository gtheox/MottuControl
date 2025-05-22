import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetalhesMotos({ route }) {
  const { modelo } = route.params || { modelo: 'Modelo não informado' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Moto</Text>
      <Text style={styles.modelName}>{modelo}</Text>
      <Text style={styles.info}>
        Aqui aparecerão as informações do formulário preenchido para essa moto.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00af34',
    marginBottom: 20,
  },
  modelName: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 15,
  },
  info: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
  },
});
