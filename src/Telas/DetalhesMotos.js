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
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const statusOptions = ['Disponível', 'Alugada', 'Manutenção'];

export default function DetalhesMotos({ route, navigation }) {
  const { modelo } = route.params;
  const [motos, setMotos] = useState([]);
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const [motosFiltradas, setMotosFiltradas] = useState([]);
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);

  // Modal alterar status
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [motoSelecionada, setMotoSelecionada] = useState(null);
  const [novoStatus, setNovoStatus] = useState('');

  // Modal editar cliente
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [buscaCliente, setBuscaCliente] = useState('');

  useEffect(() => {
    carregarMotos();
    carregarClientes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroPlaca, statusFiltro, motos]);

  useEffect(() => {
    filtrarClientes(buscaCliente);
  }, [buscaCliente, clientes]);

  const carregarMotos = async () => {
    try {
      const jsonMotos = await AsyncStorage.getItem('@motos_list');
      const todasMotos = jsonMotos ? JSON.parse(jsonMotos) : [];
      const motosDoModelo = todasMotos.filter(moto => moto.modelo === modelo);
      setMotos(motosDoModelo);
    } catch (error) {
      console.log('Erro ao carregar motos:', error);
    }
  };

  const carregarClientes = async () => {
    try {
      const jsonClientes = await AsyncStorage.getItem('@clientes_list');
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

  const aplicarFiltros = () => {
    let filtradas = motos;

    if (statusFiltro !== 'Todos') {
      filtradas = filtradas.filter(moto => moto.status === statusFiltro);
    }

    if (filtroPlaca.trim() !== '') {
      const filtroLower = filtroPlaca.toLowerCase();
      filtradas = filtradas.filter(moto =>
        moto.placa.toLowerCase().includes(filtroLower)
      );
    }

    setMotosFiltradas(filtradas);
  };

  const limparFiltroPlaca = () => {
    setFiltroPlaca('');
    Keyboard.dismiss();
  };

  // Abrir modal status
  const abrirModalStatus = (moto) => {
    setMotoSelecionada(moto);
    setNovoStatus(moto.status);
    setModalStatusVisible(true);
  };

  // Salvar novo status
  const salvarNovoStatus = async () => {
    if (!novoStatus) return;

    try {
      const motosAtualizadas = motos.map(moto => {
        if (moto.id === motoSelecionada.id) {
          // Se status mudou de "Alugada" para outro, remove cliente vinculado
          if (moto.status === 'Alugada' && novoStatus !== 'Alugada') {
            return { ...moto, status: novoStatus, clienteId: null, clienteNome: null, clienteCPF: null };
          }
          return { ...moto, status: novoStatus };
        }
        return moto;
      });
      await atualizarMotosStorage(motosAtualizadas);
      setModalStatusVisible(false);
      Alert.alert('Sucesso', 'Status atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
      console.log(error);
    }
  };

  // Abrir modal cliente para editar
  const abrirModalCliente = (moto) => {
    if(moto.status !== 'Alugada'){
      Alert.alert('Aviso', 'Só é possível alterar o cliente se o status for "Alugada".');
      return;
    }
    setMotoSelecionada(moto);
    setBuscaCliente('');
    setClientesFiltrados(clientes);
    setModalClienteVisible(true);
  };

  // Atualizar cliente da moto
  const atualizarClienteMoto = async (cliente) => {
    try {
      const motosAtualizadas = motos.map(moto => {
        if (moto.id === motoSelecionada.id) {
          return {
            ...moto,
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            clienteCPF: cliente.cpf,
          };
        }
        return moto;
      });
      await atualizarMotosStorage(motosAtualizadas);
      setModalClienteVisible(false);
      Alert.alert('Sucesso', 'Cliente associado à moto atualizado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o cliente da moto.');
      console.log(error);
    }
  };

  // Atualiza o AsyncStorage e o estado local
  const atualizarMotosStorage = async (listaAtualizada) => {
    setMotos(listaAtualizada);
    setMotosFiltradas(listaAtualizada);

    const todasMotosJson = await AsyncStorage.getItem('@motos_list');
    let todasMotos = todasMotosJson ? JSON.parse(todasMotosJson) : [];

    todasMotos = todasMotos.map(moto => {
      const motoAtualizada = listaAtualizada.find(m => m.id === moto.id);
      return motoAtualizada ? motoAtualizada : moto;
    });

    await AsyncStorage.setItem('@motos_list', JSON.stringify(todasMotos));
  };

  // Deletar moto
  const deletarMoto = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar essa moto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const motosFiltradas = motos.filter(moto => moto.id !== id);
              await atualizarMotosStorage(motosFiltradas);
              Alert.alert('Sucesso', 'Moto deletada com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a moto.');
              console.log(error);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#00af34" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Motos: {modelo}</Text>

      <View style={styles.searchFiltroContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar por placa"
            value={filtroPlaca}
            onChangeText={setFiltroPlaca}
            autoCapitalize="characters"
          />
          {filtroPlaca.length > 0 && (
            <TouchableOpacity onPress={limparFiltroPlaca} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="#00af34" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filtroButton}
          onPress={() => setModalFiltroVisible(true)}
        >
          <Text style={styles.filtroButtonText}>Filtro: {statusFiltro}</Text>
          <Ionicons name="filter" size={20} color="#00af34" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={motosFiltradas}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma moto encontrada.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.motoItem}>
            <Text style={styles.motoModelo}>Modelo: {item.modelo}</Text>
            <Text style={styles.motoInfo}>Placa: {item.placa}</Text>
            <Text style={styles.motoInfo}>Status: {item.status}</Text>
            <Text style={styles.motoInfo}>Pátio: {item.patio || '-'}</Text>
            {item.status === 'Alugada' && item.clienteNome && (
              <>
                <Text style={styles.motoInfo}>Cliente: {item.clienteNome}</Text>
                <Text style={styles.motoInfo}>CPF: {item.clienteCPF}</Text>
              </>
            )}

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#000' }]}
                onPress={() => abrirModalCliente(item)}
              >
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>Editar Cliente</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#000' }]}
                onPress={() => abrirModalStatus(item)}
              >
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>Alterar Status</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#000' }]}
                onPress={() => deletarMoto(item.id)}
              >
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal filtro */}
      <Modal
        visible={modalFiltroVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalFiltroVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalFiltroVisible(false)}
        >
          <View style={styles.modalContent}>
            {['Todos', 'Disponível', 'Alugada', 'Manutenção'].map((status, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.modalOption,
                  statusFiltro === status && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setStatusFiltro(status);
                  setModalFiltroVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    statusFiltro === status && styles.modalOptionTextSelected,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal alterar status */}
      <Modal
        visible={modalStatusVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalStatusVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalStatusVisible(false)}
        >
          <View style={styles.modalCenteredView}>
            <View style={styles.modalContent}>
              {statusOptions.map((status, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.modalOption,
                    novoStatus === status && styles.modalOptionSelected,
                  ]}
                  onPress={() => setNovoStatus(status)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      novoStatus === status && styles.modalOptionTextSelected,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
              <Button title="Salvar" onPress={salvarNovoStatus} color="#00af34" />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal editar cliente */}
      <Modal
        visible={modalClienteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalClienteVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalClienteVisible(false)}
        >
          <View style={styles.modalCenteredView}>
            <View style={styles.modalContentCliente}>
              <TextInput
                style={styles.inputCliente}
                placeholder="Pesquisar cliente"
                value={buscaCliente}
                onChangeText={setBuscaCliente}
                autoFocus
                placeholderTextColor="#555"
              />
              <FlatList
                data={clientesFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.clienteItem}
                    onPress={() => atualizarClienteMoto(item)}
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
                style={{ maxHeight: 300 }}
              />
              <Button
                title="Fechar"
                onPress={() => setModalClienteVisible(false)}
                color="#00af34"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 15,
    textAlign: 'center',
  },
  searchFiltroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 5,
  },
  filtroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#00af34',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filtroButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  motoItem: {
    backgroundColor: '#00af34',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  motoModelo: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  motoInfo: {
    color: '#000',
    marginTop: 4,
  },
  emptyText: {
    marginTop: 50,
    textAlign: 'center',
    color: '#777',
    fontSize: 18,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  modalCenteredView: {
    backgroundColor: '#004d00',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  modalContent: {
    flexGrow: 1,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#006622',
  },
  modalOptionSelected: {
    backgroundColor: '#00af34',
  },
  modalOptionText: {
    color: '#cce5cc',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  modalContentCliente: {
    flexGrow: 1,
  },
  inputCliente: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
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
});
