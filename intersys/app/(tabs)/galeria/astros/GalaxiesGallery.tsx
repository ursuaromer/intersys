import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type GalaxyItem = {
  title: string;
  description: string;
  date_created: string;
  imageUrl: string;
};

export default function GalaxiesGallery() {
  const [galaxies, setGalaxies] = useState<GalaxyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const fetchGalaxies = async () => {
    try {
      const response = await fetch('https://images-api.nasa.gov/search?q=galaxy&media_type=image');
      const data = await response.json();
      const items = data.collection.items.slice(0, 15);

      const formatted = items.map((item: any) => ({
        title: item.data[0]?.title || 'Sin título',
        description: item.data[0]?.description || 'Sin descripción',
        date_created: item.data[0]?.date_created,
        imageUrl: item.links?.[0]?.href,
      }));

      setGalaxies(formatted);
    } catch (error) {
      console.error('Error al obtener galaxias:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGalaxies();
  };

  const handleCardPress = (index: number) => {
    setSelectedCard(selectedCard === index ? null : index);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    fetchGalaxies();
  }, []);

  const renderItem = ({ item, index }: { item: GalaxyItem; index: number }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => handleCardPress(index)}
    >
      <Animated.View style={[
        styles.card,
        selectedCard === index && styles.cardExpanded,
        { transform: [{ scale: selectedCard === index ? scaleAnim : 1 }] }
      ]}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={[
            styles.image,
            selectedCard === index && styles.imageExpanded
          ]} 
          resizeMode="cover" 
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={selectedCard === index ? undefined : 3}>
            {item.description || 'Descripción no disponible'}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.date}>📅 {new Date(item.date_created).toLocaleDateString()}</Text>
            {selectedCard === index && (
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>Más detalles</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🌌 Galaxia</Text>
        <Text style={styles.subheader}>Explora el universo infinito</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B2CBF" />
          <Text style={styles.loadingText}>Descubriendo galaxias...</Text>
        </View>
      ) : (
        <FlatList
          data={galaxies}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>✨ {galaxies.length} galaxias encontradas</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  headerContainer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#1A0A2A',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subheader: {
    fontSize: 16,
    color: '#9D4EDD',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: '#1A0A2A',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  statsText: {
    color: '#E0AAFF',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1E1E3A',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(123, 44, 191, 0.2)',
    transform: [{ scale: 1 }],
  },
  cardExpanded: {
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
    borderColor: 'rgba(123, 44, 191, 0.5)',
  },
  image: {
    width: '100%',
    height: 220,
  },
  imageExpanded: {
    height: 250,
  },
  cardContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#E0E0E0',
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  date: {
    fontSize: 14,
    color: '#9D4EDD',
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#9D4EDD',
    fontSize: 16,
    fontWeight: '500',
  },
});