import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }) {
  return (
    <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Mottu Control</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MotosTab')}
        >
          <Text style={styles.buttonText}>Ver Motos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FormularioTab')}
        >
          <Text style={styles.buttonText}>Cadastrar Moto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ConfiguracoesTab')}
        >
          <Text style={styles.buttonText}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00af34',
  },
  buttonsContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00af34',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 12,
    shadowColor: '#004d00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
