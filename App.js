import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import Home from './src/Telas/Home';
import Motos from './src/Telas/Motos';
import DetalhesMotos from './src/Telas/DetalhesMotos';
import FormularioMotos from './src/Telas/FormularioMotos';
import Configuracoes from './src/Telas/Configuracoes';

import ListaClientes from './src/Telas/ListaClientes';
import FormularioClientes from './src/Telas/FormularioClientes';
import DetalhesCliente from './src/Telas/DetalhesCliente';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MotosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Motos" component={Motos} />
      <Stack.Screen name="DetalhesMotos" component={DetalhesMotos} />
    </Stack.Navigator>
  );
}

function ClientesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaClientes" component={ListaClientes} />
      <Stack.Screen name="FormularioClientes" component={FormularioClientes} />
      <Stack.Screen name="DetalhesCliente" component={DetalhesCliente} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'MotosTab') {
              iconName = focused ? 'bicycle' : 'bicycle-outline';
            } else if (route.name === 'ClientesTab') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'FormularioTab') {
              iconName = focused ? 'create' : 'create-outline';
            } else if (route.name === 'ConfiguracoesTab') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00af34',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={Home}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen
          name="MotosTab"
          component={MotosStack}
          options={{ tabBarLabel: 'Motos' }}
        />
        <Tab.Screen
          name="ClientesTab"
          component={ClientesStack}
          options={{ tabBarLabel: 'Clientes' }}
        />
        <Tab.Screen
          name="FormularioTab"
          component={FormularioMotos}
          options={{ tabBarLabel: 'Cadastrar' }}
        />
        <Tab.Screen
          name="ConfiguracoesTab"
          component={Configuracoes}
          options={{ tabBarLabel: 'Configurações' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
