import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

const STORAGE_KEY_MOTOS = '@motos_list';
const STORAGE_KEY_CLIENTES = '@clientes_list';

const modelos = ['Mottu Pop', 'Mottu Sport', 'Mottu-E'];
const statusOptions = ['Disponível', 'Alugada', 'Manutenção'];
const patios = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

export default function FormularioMotos({ navigation }) {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState(modelos[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [patioSelecionado, setPatioSelecionado] = useState(patios[0]);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  useEffect(() => {
    carregarClientes();
  }, []);

  useEffect(() => {
    filtrarClientes(buscaCliente);
  }, [buscaCliente, clientes]);

  const carregarClientes = async () => {
    try {
      const jsonClientes = await AsyncStorage.getItem(STORAGE_KEY_CLIENTES);
      const clientesSalvos = jsonClientes ? JSON.parse(jsonClientes) : [];
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

  const salvarMoto = async () => {
    if (!placa.trim()) {
      Alert.alert('Erro', 'A placa é obrigatória');
      return;
    }
    if (!modelo) {
      Alert.alert('Erro', 'O modelo é obrigatório');
      return;
    }
    if (!status) {
      Alert.alert('Erro', 'O status é obrigatório');
      return;
    }
    if (!patioSelecionado) {
      Alert.alert('Erro', 'Selecione o pátio');
      return;
    }
    if (status === 'Alugada' && !clienteSelecionado) {
      Alert.alert('Erro', 'Selecione o cliente que está com a moto');
      return;
    }

    try {
      const jsonMotos = await AsyncStorage.getItem(STORAGE_KEY_MOTOS);
      let motos = jsonMotos ? JSON.parse(jsonMotos) : [];

      const novaMoto = {
        id: Date.now().toString(),
        placa,
        modelo,
        status,
        patio: patioSelecionado,
        clienteId: clienteSelecionado ? clienteSelecionado.id : null,
        clienteNome: clienteSelecionado ? clienteSelecionado.nome : null,
      };

      motos.push(novaMoto);

      await AsyncStorage.setItem(STORAGE_KEY_MOTOS, JSON.stringify(motos));

      Alert.alert('Sucesso', 'Moto salva com sucesso!');

      setPlaca('');
      setModelo(modelos[0]);
      setStatus(statusOptions[0]);
      setPatioSelecionado(patios[0]);
      setClienteSelecionado(null);
      setBuscaCliente('');
      setModalVisible(false);

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a moto.');
      console.log(error);
    }
  };

  return (
    <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Cadastro de Moto</Text>

          <Text style={styles.label}>Placa *</Text>
          <TextInput
            style={styles.input}
            value={placa}
            onChangeText={setPlaca}
            placeholder="Digite a placa"
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Modelo *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={modelo}
              onValueChange={setModelo}
              style={styles.picker}
              dropdownIconColor="#00af34"
            >
              {modelos.map((mod, i) => (
                <Picker.Item key={i} label={mod} value={mod} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Status *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
              style={styles.picker}
              dropdownIconColor="#00af34"
            >
              {statusOptions.map((statusOpt, i) => (
                <Picker.Item key={i} label={statusOpt} value={statusOpt} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Pátio *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={patioSelecionado}
              onValueChange={setPatioSelecionado}
              style={styles.picker}
              dropdownIconColor="#00af34"
            >
              {patios.map((num) => (
                <Picker.Item key={num} label={num} value={num} />
              ))}
            </Picker>
          </View>

          {status === 'Alugada' && (
            <>
              <Text style={styles.label}>Cliente que está com a moto *</Text>
              <TouchableOpacity
                style={styles.selectClienteButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.selectClienteText}>
                  {clienteSelecionado
                    ? `${clienteSelecionado.nome} (CPF: ${clienteSelecionado.cpf})`
                    : 'Selecione um cliente'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Pesquisar cliente"
                    value={buscaCliente}
                    onChangeText={setBuscaCliente}
                    autoFocus
                  />
                  <FlatList
                    data={clientesFiltrados}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.clienteItem}
                        onPress={() => {
                          setClienteSelecionado(item);
                          setModalVisible(false);
                          setBuscaCliente('');
                        }}
                      >
                        <Text style={styles.clienteNome}>
                          {item.nome} (CPF: {item.cpf})
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
                    }
                    keyboardShouldPersistTaps="handled"
                  />
                  <Button
                    title="Fechar"
                    onPress={() => setModalVisible(false)}
                    color="#00af34"
                  />
                </View>
              </Modal>
            </>
          )}

          <Button title="Salvar Moto" onPress={salvarMoto} color="#00af34" />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#00af34',
    textAlign: 'center',
  },
  label: {
    color: '#00af34',
    marginBottom: 5,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  selectClienteButton: {
    padding: 15,
    backgroundColor: '#00af34',
    borderRadius: 8,
    marginBottom: 20,
  },
  selectClienteText: {
    color: '#000',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  clienteItem: {
    paddingVertical: 12,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  clienteNome: {
    color: '#00af34',
    fontSize: 18,
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
