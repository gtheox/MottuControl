import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetalhesCliente({ route, navigation }) {
  const cliente = route.params?.cliente;
  const [motosAlugadas, setMotosAlugadas] = useState([]);

  useEffect(() => {
    if (cliente) {
      carregarMotosAlugadas(cliente.id);
    }
  }, [cliente]);

  const carregarMotosAlugadas = async (clienteId) => {
    try {
      const jsonMotos = await AsyncStorage.getItem('@motos_list');
      const motos = jsonMotos ? JSON.parse(jsonMotos) : [];
      const alugadas = motos.filter(
        moto => moto.clienteId === clienteId && moto.status === 'Alugada'
      );
      setMotosAlugadas(alugadas);
    } catch (error) {
      console.log('Erro ao carregar motos:', error);
    }
  };

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

        <View style={styles.divider} />

        <Text style={styles.subTitle}>Motos Alugadas</Text>
        {motosAlugadas.length > 0 ? (
          motosAlugadas.map((moto) => (
            <View key={moto.id} style={styles.motoItem}>
              <Text style={styles.motoText}>Modelo: {moto.modelo}</Text>
              <Text style={styles.motoText}>Placa: {moto.placa}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noMotosText}>Este cliente não possui motos alugadas.</Text>
        )}
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
  divider: {
    borderBottomColor: '#00af34',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00af34',
    marginBottom: 15,
  },
  motoItem: {
    backgroundColor: '#006622',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  motoText: {
    color: '#cce5cc',
    fontSize: 16,
  },
  noMotosText: {
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
  },
});
