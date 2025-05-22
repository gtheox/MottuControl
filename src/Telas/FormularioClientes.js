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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { MaskedTextInput } from 'react-native-mask-text';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const STORAGE_KEY = '@clientes_list';

export default function FormularioClientes({ navigation, route }) {
  const clienteParaEditar = route.params?.clienteParaEditar;

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    if (clienteParaEditar) {
      setNome(clienteParaEditar.nome || '');
      setCpf(clienteParaEditar.cpf || '');
      setTelefone(clienteParaEditar.telefone || '');
      setCep(clienteParaEditar.cep || '');
      setEndereco(clienteParaEditar.endereco || '');
      setNumero(clienteParaEditar.numero || '');
      setComplemento(clienteParaEditar.complemento || '');
      setDataNascimento(clienteParaEditar.dataNascimento || '');
      setEmail(clienteParaEditar.email || '');
    }
  }, [clienteParaEditar]);

  function validarCPF(strCPF) {
    let cpfLimpo = strCPF.replace(/[^\d]+/g, '');
    if (cpfLimpo.length !== 11 || /^(\d)\1+$/.test(cpfLimpo)) return false;
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

    return true;
  }

  const consultarCep = async (cepConsulta) => {
    let cepLimpo = cepConsulta.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setEndereco('');
      return;
    }

    setLoadingCep(true);
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (response.data.erro) {
        Alert.alert('CEP inválido', 'Por favor, digite um CEP válido.');
        setEndereco('');
      } else {
        const { logradouro, bairro, localidade, uf } = response.data;
        setEndereco(`${logradouro}, ${bairro} - ${localidade}/${uf}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível consultar o CEP.');
      setEndereco('');
    } finally {
      setLoadingCep(false);
    }
  };

  const salvarCliente = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }
    if (!cpf.trim() || !validarCPF(cpf)) {
      Alert.alert('Erro', 'CPF inválido');
      return;
    }
    if (!cep.trim()) {
      Alert.alert('Erro', 'CEP é obrigatório');
      return;
    }
    if (!endereco.trim()) {
      Alert.alert('Erro', 'Endereço não preenchido. Por favor, consulte o CEP.');
      return;
    }

    try {
      const jsonClientes = await AsyncStorage.getItem(STORAGE_KEY);
      let clientes = jsonClientes ? JSON.parse(jsonClientes) : [];

      if (clienteParaEditar) {
        // Atualizar cliente existente
        clientes = clientes.map(c => {
          if (c.id === clienteParaEditar.id) {
            return {
              ...c,
              nome,
              cpf,
              telefone,
              cep,
              endereco,
              numero,
              complemento,
              dataNascimento,
              email,
            };
          }
          return c;
        });
      } else {
        // Criar novo cliente
        const novoCliente = {
          id: Date.now().toString(),
          nome,
          cpf,
          telefone,
          cep,
          endereco,
          numero,
          complemento,
          dataNascimento,
          email,
        };
        clientes.push(novoCliente);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));

      Alert.alert('Sucesso', clienteParaEditar ? 'Cliente atualizado!' : 'Cliente cadastrado!');

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cliente.');
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#00af34" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{clienteParaEditar ? 'Editar Cliente' : 'Cadastro de Cliente'}</Text>

          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome"
          />

          <Text style={styles.label}>CPF *</Text>
          <MaskedTextInput
            mask="999.999.999-99"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
            style={styles.input}
            placeholder="000.000.000-00"
            maxLength={14}
          />

          <Text style={styles.label}>Telefone</Text>
          <MaskedTextInput
            mask="(99) 99999-9999"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
            style={styles.input}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />

          <Text style={styles.label}>CEP *</Text>
          <MaskedTextInput
            mask="99999-999"
            keyboardType="numeric"
            value={cep}
            onChangeText={(text) => {
              setCep(text);
              if (text.replace(/\D/g, '').length === 8) {
                consultarCep(text);
              } else {
                setEndereco('');
              }
            }}
            style={styles.input}
            placeholder="00000-000"
            maxLength={9}
          />

          {loadingCep && <ActivityIndicator size="small" color="#00af34" />}

          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#eee' }]}
            value={endereco}
            editable={false}
            placeholder="Endereço será preenchido automaticamente"
          />

          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            value={numero}
            onChangeText={setNumero}
            placeholder="Digite o número"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Complemento</Text>
          <TextInput
            style={styles.input}
            value={complemento}
            onChangeText={setComplemento}
            placeholder="Digite complemento (opcional)"
          />

          <Text style={styles.label}>Data de Nascimento</Text>
          <MaskedTextInput
            mask="99/99/9999"
            keyboardType="numeric"
            value={dataNascimento}
            onChangeText={setDataNascimento}
            style={styles.input}
            placeholder="DD/MM/AAAA"
            maxLength={10}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite o email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            title={clienteParaEditar ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            onPress={salvarCliente}
            color="#00af34"
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 25,
    color: '#00af34',
    textAlign: 'center',
  },
  label: { color: '#00af34', marginBottom: 5, fontSize: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
});
