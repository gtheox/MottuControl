import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetalhesCliente({ route, navigation }) {
  const cliente = route.params?.cliente;

  if (!cliente) {
    return (
      <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
        <Text style={styles.text}>Nenhum dado do cliente disponível.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Botão Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#00af34" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Detalhes do Cliente</Text>

        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{cliente.nome}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{cliente.cpf}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>{cliente.telefone || '-'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{cliente.email || '-'}</Text>

        <Text style={styles.label}>CEP:</Text>
        <Text style={styles.value}>{cliente.cep || '-'}</Text>

        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>{cliente.endereco || '-'}</Text>

        <Text style={styles.label}>Número:</Text>
        <Text style={styles.value}>{cliente.numero || '-'}</Text>

        <Text style={styles.label}>Complemento:</Text>
        <Text style={styles.value}>{cliente.complemento || '-'}</Text>

        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.value}>{cliente.dataNascimento || '-'}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backText: {
    color: '#00af34',
    fontSize: 18,
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00af34',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#00af34',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
  },
});
