import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const motosCatalogo = [
  {
    modelo: 'Mottu Pop',
    imagem: require('../../assets/pop.png'),
  },
  {
    modelo: 'Mottu Sport',
    imagem: require('../../assets/sport.png'),
  },
  {
    modelo: 'Mottu-E',
    imagem: require('../../assets/mottu-e.png'),
  },
];

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.95;
const ITEM_HEIGHT = height * 0.65;

export default function Motos({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const goPrev = () => {
    const prevIndex = currentIndex === 0 ? motosCatalogo.length - 1 : currentIndex - 1;
    flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    setCurrentIndex(prevIndex);
  };

  const goNext = () => {
    const nextIndex = currentIndex === motosCatalogo.length - 1 ? 0 : currentIndex + 1;
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  };

  const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('DetalhesMotos', { modelo: item.modelo })}
      style={styles.card}
    >
      <Image source={item.imagem} style={styles.image} resizeMode="contain" />
      <Text style={styles.modelo}>{item.modelo}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#000000', '#004d00']} style={styles.container}>
      <Text style={styles.title}>Catálogo de Motos</Text>

      <View style={styles.carouselContainer}>
        <TouchableOpacity onPress={goPrev} style={styles.arrowLeft}>
          <Ionicons name="chevron-back" size={40} color="#000" />
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={motosCatalogo}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          initialScrollIndex={currentIndex}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        <TouchableOpacity onPress={goNext} style={styles.arrowRight}>
          <Ionicons name="chevron-forward" size={40} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.indicators}>
        {motosCatalogo.map((_, index) => (
          <TouchableOpacity
            key={index.toString()}
            style={[
              styles.indicator,
              currentIndex === index ? styles.activeIndicator : null,
            ]}
            onPress={() => {
              flatListRef.current.scrollToIndex({ index, animated: true });
              setCurrentIndex(index);
            }}
          />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00af34',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 15,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT + 80,
    backgroundColor: '#00af34',
    borderRadius: 25,
    marginHorizontal: 10,
    alignItems: 'center',
    padding: 20,
    shadowColor: '#006622',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: ITEM_HEIGHT,
  },
  modelo: {
    marginTop: 15,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  arrowLeft: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  arrowRight: {
    position: 'absolute',
    right: 10,
    zIndex: 10,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000',
    marginHorizontal: 8,
  },
  activeIndicator: {
    backgroundColor: '#00af34',
  },
});
