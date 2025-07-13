import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Si usas Expo
// import LinearGradient from 'react-native-linear-gradient'; // Si usas React Native CLI

const { width, height } = Dimensions.get('window');

/**
 * Componente principal para mostrar información sobre telescopios y observatorios
 * Utiliza la API de NASA para obtener imágenes y datos relevantes
 */
const TelescopiosObservatorios = () => {
  // Estados para manejar los datos y la interfaz
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apodData, setApodData] = useState(null);
  const [telescopesData, setTelescopesData] = useState([]);
  const [selectedTelescope, setSelectedTelescope] = useState(0);

  // Clave API de NASA
  const NASA_API_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB';

  // Datos estáticos de telescopios famosos para complementar la API
  const telescopesInfo = [
    {
      id: 1,
      name: 'Telescopio Espacial Hubble',
      description: 'El telescopio espacial más famoso, operativo desde 1990. Ha revolucionado nuestra comprensión del universo.',
      launched: '1990',
      type: 'Telescopio Espacial Óptico',
      altitude: '547 km',
      mission: 'Observación del espacio profundo',
      achievements: [
        'Determinó la edad del universo',
        'Descubrió la expansión acelerada del universo',
        'Captó imágenes de galaxias distantes'
      ]
    },
    {
      id: 2,
      name: 'Telescopio Espacial James Webb',
      description: 'El sucesor del Hubble, el telescopio espacial más potente jamás construido.',
      launched: '2021',
      type: 'Telescopio Espacial Infrarrojo',
      altitude: '1.5 millones km (L2)',
      mission: 'Observación infrarroja del universo primitivo',
      achievements: [
        'Primeras imágenes en color del universo profundo',
        'Análisis de atmósferas de exoplanetas',
        'Observación de las primeras galaxias'
      ]
    },
    {
      id: 3,
      name: 'Telescopio Espacial Kepler',
      description: 'Especializado en la búsqueda de exoplanetas similares a la Tierra.',
      launched: '2009',
      type: 'Telescopio Espacial de Tránsito',
      altitude: 'Órbita heliocéntrica',
      mission: 'Búsqueda de exoplanetas',
      achievements: [
        'Descubrió más de 2,600 exoplanetas',
        'Identificó planetas en zona habitable',
        'Revolucionó la astronomía de exoplanetas'
      ]
    }
  ];

  /**
   * Obtiene la imagen astronómica del día (APOD) de NASA
   * Esta función se conecta a la API APOD para obtener contenido visual atractivo
   */
  const fetchAPOD = async () => {
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
      );
      const data = await response.json();
      setApodData(data);
    } catch (error) {
      console.error('Error al obtener APOD:', error);
      Alert.alert('Error', 'No se pudo cargar la imagen del día');
    }
  };

  /**
   * Función para buscar imágenes relacionadas con telescopios
   * Utiliza la API de búsqueda de imágenes de NASA
   */
  const fetchTelescopeImages = async () => {
    try {
      const searches = ['hubble telescope', 'james webb telescope', 'space observatory'];
      const imagePromises = searches.map(async (query) => {
        const response = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=3`
        );
        const data = await response.json();
        return data.collection.items;
      });

      const results = await Promise.all(imagePromises);
      const flattenedResults = results.flat();
      setTelescopesData(flattenedResults);
    } catch (error) {
      console.error('Error al obtener imágenes de telescopios:', error);
    }
  };

  /**
   * Función para cargar todos los datos iniciales
   * Combina las llamadas a diferentes endpoints de la API
   */
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAPOD(),
        fetchTelescopeImages()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para refrescar los datos
   * Se ejecuta cuando el usuario desliza hacia abajo
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  /**
   * Efecto para cargar datos al montar el componente
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Componente para renderizar la carta de un telescopio
   * @param {Object} telescope - Información del telescopio
   * @param {number} index - Índice del telescopio en el array
   */
  const TelescopeCard = ({ telescope, index }) => (
    <TouchableOpacity
      style={[
        styles.telescopeCard,
        selectedTelescope === index && styles.selectedCard
      ]}
      onPress={() => setSelectedTelescope(index)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.cardGradient}
      >
        <Text style={styles.telescopeName}>{telescope.name}</Text>
        <Text style={styles.telescopeType}>{telescope.type}</Text>
        <Text style={styles.telescopeLaunched}>Lanzado: {telescope.launched}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  /**
   * Componente para mostrar los detalles del telescopio seleccionado
   */
  const TelescopeDetails = () => {
    const selectedTelescopeData = telescopesInfo[selectedTelescope];

    return (
      <View style={styles.detailsContainer}>
        <LinearGradient
          colors={['#0f3460', '#16213e']}
          style={styles.detailsGradient}
        >
          <Text style={styles.detailsTitle}>{selectedTelescopeData.name}</Text>
          <Text style={styles.detailsDescription}>
            {selectedTelescopeData.description}
          </Text>
          
          <View style={styles.specificationsContainer}>
            <Text style={styles.specificationsTitle}>Especificaciones:</Text>
            <Text style={styles.specification}>
              📡 Tipo: {selectedTelescopeData.type}
            </Text>
            <Text style={styles.specification}>
              🚀 Lanzamiento: {selectedTelescopeData.launched}
            </Text>
            <Text style={styles.specification}>
              🌌 Altitud: {selectedTelescopeData.altitude}
            </Text>
            <Text style={styles.specification}>
              🎯 Misión: {selectedTelescopeData.mission}
            </Text>
          </View>

          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>Logros Principales:</Text>
            {selectedTelescopeData.achievements.map((achievement, index) => (
              <Text key={index} style={styles.achievement}>
                ⭐ {achievement}
              </Text>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  };

  /**
   * Componente para mostrar la imagen del día de NASA
   */
  const APODSection = () => {
    if (!apodData) return null;

    return (
      <View style={styles.apodContainer}>
        <Text style={styles.apodTitle}>Imagen Astronómica del Día</Text>
        <Image
          source={{ uri: apodData.url }}
          style={styles.apodImage}
          resizeMode="cover"
        />
        <Text style={styles.apodImageTitle}>{apodData.title}</Text>
        <Text style={styles.apodDate}>{apodData.date}</Text>
      </View>
    );
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Cargando datos espaciales...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a90e2']}
            progressBackgroundColor="#1a1a2e"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header con título */}
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>🔭 Telescopios y Observatorios</Text>
          <Text style={styles.headerSubtitle}>
            Explorando el cosmos con la tecnología más avanzada
          </Text>
        </LinearGradient>

        {/* Sección de imagen astronómica del día */}
        <APODSection />

        {/* Selector de telescopios */}
        <View style={styles.telescopesSection}>
          <Text style={styles.sectionTitle}>Telescopios Espaciales</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.telescopesScroll}
          >
            {telescopesInfo.map((telescope, index) => (
              <TelescopeCard key={telescope.id} telescope={telescope} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Detalles del telescopio seleccionado */}
        <TelescopeDetails />

        {/* Galería de imágenes de NASA */}
        {telescopesData.length > 0 && (
          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>Galería NASA</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.galleryScroll}
            >
              {telescopesData.slice(0, 6).map((item, index) => (
                <TouchableOpacity key={index} style={styles.galleryItem}>
                  <Image
                    source={{ uri: item.links[0].href }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.galleryTitle} numberOfLines={2}>
                    {item.data[0].title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos para el componente con tema oscuro
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  apodContainer: {
    margin: 20,
    marginTop: 10,
  },
  apodTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4a90e2',
    marginBottom: 15,
  },
  apodImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  apodImageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 5,
  },
  apodDate: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  telescopesSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 20,
    marginBottom: 15,
  },
  telescopesScroll: {
    paddingLeft: 20,
  },
  telescopeCard: {
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  selectedCard: {
    transform: [{ scale: 1.05 }],
  },
  cardGradient: {
    padding: 20,
    width: width * 0.7,
    minHeight: 120,
    justifyContent: 'center',
  },
  telescopeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  telescopeType: {
    fontSize: 14,
    color: '#4a90e2',
    marginBottom: 5,
  },
  telescopeLaunched: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  detailsContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  detailsGradient: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 24,
    marginBottom: 20,
  },
  specificationsContainer: {
    marginBottom: 20,
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a90e2',
    marginBottom: 10,
  },
  specification: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    paddingLeft: 5,
  },
  achievementsContainer: {
    marginTop: 10,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a90e2',
    marginBottom: 10,
  },
  achievement: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    paddingLeft: 5,
  },
  gallerySection: {
    marginVertical: 20,
  },
  galleryScroll: {
    paddingLeft: 20,
  },
  galleryItem: {
    marginRight: 15,
    width: 150,
  },
  galleryImage: {
    width: 150,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  galleryTitle: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default TelescopiosObservatorios;