import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const STORAGE_KEY = '@clientes_list';

export default function ListaClientes({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  useEffect(() => {
    carregarClientes();
  }, []);

  useEffect(() => {
    filtrarClientes(filtro);
  }, [filtro, clientes]);

  const carregarClientes = async () => {
    try {
      const jsonClientes = await AsyncStorage.getItem(STORAGE_KEY);
      let clientesSalvos = jsonClientes ? JSON.parse(jsonClientes) : [];

      // Ordena alfabeticamente pelo nome
      clientesSalvos.sort((a, b) => a.nome.localeCompare(b.nome));

      setClientes(clientesSalvos);
      setClientesFiltrados(clientesSalvos);
    } catch (error) {
      console.log('Erro ao carregar clientes:', error);
    }
  };

  const filtrarClientes = (texto) => {
    const textoMinusculo = texto.toLowerCase();
    const filtrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(textoMinusculo)
    );
    setClientesFiltrados(filtrados);
  };

  const limparFiltro = () => {
    setFiltro('');
    Keyboard.dismiss();
  };

  const confirmarExcluir = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirCliente(id) },
      ]
    );
  };

  const excluirCliente = async (id) => {
    try {
      const novosClientes = clientes.filter(c => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosClientes));
      setClientes(novosClientes);
      setClientesFiltrados(novosClientes);
      Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o cliente.');
      console.log(error);
    }
  };

  const navegarEditar = (cliente) => {
    navigation.navigate('FormularioClientes', { clienteParaEditar: cliente });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.navigate('DetalhesCliente', { cliente: item })}
      >
        <Text style={styles.nome}>{item.nome}</Text>
        {item.telefone ? <Text style={styles.info}>Telefone: {item.telefone}</Text> : null}
        {item.email ? <Text style={styles.info}>Email: {item.email}</Text> : null}
        {item.cpf ? <Text style={styles.info}>CPF: {item.cpf}</Text> : null}
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navegarEditar(item)}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => confirmarExcluir(item.id)}
        >
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
      <Button
        title="Cadastrar Novo Cliente"
        onPress={() => navigation.navigate('FormularioClientes')}
        color="#00af34"
      />

      <Text style={styles.title}>Lista de Clientes</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar por nome"
          value={filtro}
          onChangeText={setFiltro}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {filtro.length > 0 && (
          <TouchableOpacity onPress={limparFiltro} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="#00af34" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={clientesFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
        }
        keyboardShouldPersistTaps="handled"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#00af34',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#00af34',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  info: {
    color: '#333',
    marginTop: 5,
  },
  emptyText: {
    marginTop: 50,
    textAlign: 'center',
    color: '#777',
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#000',
  },
  deleteButton: {
    backgroundColor: '#b22222',
  },
});
