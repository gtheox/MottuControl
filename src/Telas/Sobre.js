import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Sobre() {
  const desenvolvedores = [
    {
      nome: 'Gabriel Teodoro',
      rm: '555962',
      github: 'https://github.com/gtheox',
      linkedin: 'https://www.linkedin.com/in/gabriel-teodoro-gon%C3%A7alves-rosa-a26970236/',
      foto: require('../../assets/gabriel.png'), // Substitua com a imagem de cada desenvolvedor
    },
    {
      nome: 'Luka Shibuya',
      rm: '558123',
      github: 'https://github.com/lukashibuya',
      linkedin: 'https://www.linkedin.com/in/luka-shibuya-b62a322b3/',
      foto: require('../../assets/luka.png'), // Substitua com a imagem de cada desenvolvedor
    },
    {
      nome: 'Eduardo Giovannini',
      rm: '555030',
      github: 'https://github.com/DuGiovannini',
      linkedin: 'https://www.linkedin.com/in/eduardo-giovannini-157216262/',
      foto: require('../../assets/du.png'), // Substitua com a imagem de cada desenvolvedor
    },
  ];

  return (
    <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sobre o Projeto</Text>

        {/* Texto explicativo sobre o propósito do projeto */}
        <Text style={styles.explanation}>
          Este projeto foi desenvolvido como parte de um desafio acadêmico para a criação de uma solução de
          mapeamento e monitoramento inteligente de motos em pátios de uma empresa. O objetivo é fornecer uma
          plataforma eficiente e escalável para gerenciar as motos de forma inteligente, utilizando tecnologias
          de Internet das Coisas (IoT) e Visão Computacional.
        </Text>

        <Text style={styles.subTitle}>Desenvolvedores</Text>

        {/* Exibição dos desenvolvedores na vertical */}
        <View style={styles.devsContainer}>
          {desenvolvedores.map((dev, index) => (
            <View key={index} style={styles.devCard}>
              <Image source={dev.foto} style={styles.foto} />
              <Text style={styles.devName}>{dev.nome}</Text>
              <Text style={styles.devRM}>RM: {dev.rm}</Text>

              <View style={styles.socialLinks}>
                <TouchableOpacity onPress={() => Linking.openURL(dev.github)}>
                  <Ionicons name="logo-github" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(dev.linkedin)}>
                  <Ionicons name="logo-linkedin" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  content: { paddingBottom: 30 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00af34',
    marginBottom: 20,
    textAlign: 'center',
  },
  explanation: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00af34',
    marginBottom: 20,
    textAlign: 'center',
  },
  devsContainer: {
    flexDirection: 'column',  // Exibe os desenvolvedores em uma coluna (vertical)
    alignItems: 'center',     // Centraliza os cards
  },
  devCard: {
    backgroundColor: '#006622',
    padding: 20,
    borderRadius: 10,
    width: '90%',  // Ajusta o tamanho do card para 90% da largura da tela
    marginBottom: 20,
    alignItems: 'center',
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  devName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  devRM: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});
