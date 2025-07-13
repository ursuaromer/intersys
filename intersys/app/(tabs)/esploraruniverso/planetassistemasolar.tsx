import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/**
 * Componente principal para mostrar los planetas del sistema solar
 * Utiliza la API de NASA para obtener información astronómica
 */
const SolarSystemPlanets = () => {
  // Estados para el manejo de datos y UI
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [astronomyData, setAstronomyData] = useState(null);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Tu API Key de NASA
  const NASA_API_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB';

  /**
   * Datos estáticos de los planetas del sistema solar
   * Incluye información detallada de cada planeta
   */
  const solarSystemPlanets = [
    {
      id: 1,
      name: 'Mercurio',
      englishName: 'Mercury',
      diameter: '4,879 km',
      distance: '57.9 millones km',
      orbital_period: '88 días',
      temperature: '167°C',
      moons: 0,
      color: '#8C7853',
      description: 'El planeta más cercano al Sol y el más pequeño del sistema solar.',
      facts: [
        'No tiene atmósfera',
        'Temperaturas extremas',
        'Día más largo que el año',
        'Núcleo de hierro gigante'
      ]
    },
    {
      id: 2,
      name: 'Venus',
      englishName: 'Venus',
      diameter: '12,104 km',
      distance: '108.2 millones km',
      orbital_period: '225 días',
      temperature: '464°C',
      moons: 0,
      color: '#FFA500',
      description: 'El planeta más caliente del sistema solar debido a su efecto invernadero.',
      facts: [
        'Atmósfera tóxica',
        'Rota al revés',
        'Lluvia de ácido sulfúrico',
        'Presión 90 veces mayor que la Tierra'
      ]
    },
    {
      id: 3,
      name: 'Tierra',
      englishName: 'Earth',
      diameter: '12,756 km',
      distance: '149.6 millones km',
      orbital_period: '365.25 días',
      temperature: '15°C',
      moons: 1,
      color: '#4A90E2',
      description: 'Nuestro hogar, el único planeta conocido con vida.',
      facts: [
        '71% cubierto de agua',
        'Atmósfera rica en oxígeno',
        'Campo magnético protector',
        'Placas tectónicas activas'
      ]
    },
    {
      id: 4,
      name: 'Marte',
      englishName: 'Mars',
      diameter: '6,792 km',
      distance: '227.9 millones km',
      orbital_period: '687 días',
      temperature: '-65°C',
      moons: 2,
      color: '#CD5C5C',
      description: 'El planeta rojo, objetivo de futuras misiones humanas.',
      facts: [
        'Casquetes polares de hielo',
        'Volcán más grande del sistema solar',
        'Evidencia de agua antigua',
        'Días similares a la Tierra'
      ]
    },
    {
      id: 5,
      name: 'Júpiter',
      englishName: 'Jupiter',
      diameter: '142,984 km',
      distance: '778.5 millones km',
      orbital_period: '11.9 años',
      temperature: '-110°C',
      moons: 79,
      color: '#D2691E',
      description: 'El gigante gaseoso más grande del sistema solar.',
      facts: [
        'Gran Mancha Roja',
        'Protector del sistema solar',
        'Más de 79 lunas',
        'Compuesto principalmente de hidrógeno'
      ]
    },
    {
      id: 6,
      name: 'Saturno',
      englishName: 'Saturn',
      diameter: '120,536 km',
      distance: '1,432 millones km',
      orbital_period: '29.5 años',
      temperature: '-140°C',
      moons: 82,
      color: '#FAD5A5',
      description: 'Famoso por sus espectaculares anillos.',
      facts: [
        'Anillos de hielo y roca',
        'Densidad menor que el agua',
        'Hexágono en el polo norte',
        'Más de 82 lunas'
      ]
    },
    {
      id: 7,
      name: 'Urano',
      englishName: 'Uranus',
      diameter: '51,118 km',
      distance: '2,867 millones km',
      orbital_period: '84 años',
      temperature: '-195°C',
      moons: 27,
      color: '#4FD0E7',
      description: 'El gigante de hielo que rota de lado.',
      facts: [
        'Rota de lado',
        'Anillos verticales',
        'Compuesto de hielo y roca',
        'Descubierto en 1781'
      ]
    },
    {
      id: 8,
      name: 'Neptuno',
      englishName: 'Neptune',
      diameter: '49,528 km',
      distance: '4,515 millones km',
      orbital_period: '165 años',
      temperature: '-200°C',
      moons: 14,
      color: '#4169E1',
      description: 'El planeta más ventoso del sistema solar.',
      facts: [
        'Vientos de 2,100 km/h',
        'Último planeta del sistema solar',
        'Descubierto por matemáticas',
        'Compuesto de hielo y roca'
      ]
    }
  ];

  /**
   * Efecto que se ejecuta al montar el componente
   * Inicializa las animaciones y carga los datos
   */
  useEffect(() => {
    initializeComponent();
    fetchAstronomyData();
  }, []);

  /**
   * Inicializa las animaciones del componente
   */
  const initializeComponent = () => {
    setPlanets(solarSystemPlanets);
    setLoading(false);
    
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /**
   * Obtiene datos astronómicos del día desde la API de NASA
   * Utiliza el endpoint APOD (Astronomy Picture of the Day)
   */
  const fetchAstronomyData = async () => {
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
      );
      const data = await response.json();
      setAstronomyData(data);
    } catch (error) {
      console.error('Error fetching astronomy data:', error);
      Alert.alert('Error', 'No se pudo cargar la información astronómica del día');
    }
  };

  /**
   * Maneja la selección de un planeta
   * Abre el modal con información detallada
   * @param {Object} planet - Objeto del planeta seleccionado
   */
  const handlePlanetPress = (planet) => {
    setSelectedPlanet(planet);
    setModalVisible(true);
  };

  /**
   * Cierra el modal de información detallada
   */
  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlanet(null);
  };

  /**
   * Renderiza cada planeta en la lista
   * @param {Object} item - Objeto del planeta
   * @param {number} index - Índice del planeta en la lista
   */
  const renderPlanet = ({ item, index }) => {
    const animationDelay = index * 200;
    
    return (
      <Animated.View
        style={[
          styles.planetCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.planetButton}
          onPress={() => handlePlanetPress(item)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[item.color, '#1a1a1a']}
            style={styles.planetGradient}
          >
            <View style={styles.planetInfo}>
              <View style={[styles.planetIcon, { backgroundColor: item.color }]}>
                <Text style={styles.planetEmoji}>🪐</Text>
              </View>
              <View style={styles.planetDetails}>
                <Text style={styles.planetName}>{item.name}</Text>
                <Text style={styles.planetDistance}>{item.distance} del Sol</Text>
                <Text style={styles.planetMoons}>
                  {item.moons} {item.moons === 1 ? 'luna' : 'lunas'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  /**
   * Renderiza el modal con información detallada del planeta
   */
  const renderPlanetModal = () => {
    if (!selectedPlanet) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={[styles.modalPlanetIcon, { backgroundColor: selectedPlanet.color }]}>
                  <Text style={styles.modalPlanetEmoji}>🪐</Text>
                </View>
                <Text style={styles.modalPlanetName}>{selectedPlanet.name}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalDescription}>{selectedPlanet.description}</Text>
              
              <View style={styles.modalStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Diámetro</Text>
                  <Text style={styles.statValue}>{selectedPlanet.diameter}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Distancia al Sol</Text>
                  <Text style={styles.statValue}>{selectedPlanet.distance}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Período Orbital</Text>
                  <Text style={styles.statValue}>{selectedPlanet.orbital_period}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Temperatura</Text>
                  <Text style={styles.statValue}>{selectedPlanet.temperature}</Text>
                </View>
              </View>
              
              <View style={styles.factsSection}>
                <Text style={styles.factsTitle}>Datos Interesantes</Text>
                {selectedPlanet.facts.map((fact, index) => (
                  <View key={index} style={styles.factItem}>
                    <Text style={styles.factBullet}>•</Text>
                    <Text style={styles.factText}>{fact}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /**
   * Renderiza la sección de astronomía del día si está disponible
   */
  const renderAstronomySection = () => {
    if (!astronomyData) return null;

    return (
      <View style={styles.astronomySection}>
        <Text style={styles.astronomyTitle}>Astronomía del Día</Text>
        <Text style={styles.astronomyDescription}>
          {astronomyData.title}
        </Text>
        {astronomyData.media_type === 'image' && (
          <Image
            source={{ uri: astronomyData.url }}
            style={styles.astronomyImage}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando sistema solar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header del componente */}
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Sistema Solar</Text>
        <Text style={styles.headerSubtitle}>Explora los planetas</Text>
      </LinearGradient>

      {/* Sección de astronomía del día */}
      {renderAstronomySection()}

      {/* Lista de planetas */}
      <FlatList
        data={planets}
        renderItem={renderPlanet}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.planetsList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Modal de información detallada */}
      {renderPlanetModal()}
    </View>
  );
};

/**
 * Estilos del componente
 * Optimizados para modo oscuro
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '300',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 5,
  },
  astronomySection: {
    margin: 20,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333333',
  },
  astronomyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  astronomyDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 10,
  },
  astronomyImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  planetsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  planetCard: {
    marginVertical: 8,
  },
  planetButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  planetGradient: {
    padding: 20,
  },
  planetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planetIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  planetEmoji: {
    fontSize: 24,
  },
  planetDetails: {
    flex: 1,
  },
  planetName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  planetDistance: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  planetMoons: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 5,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: height * 0.8,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalPlanetIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalPlanetEmoji: {
    fontSize: 32,
  },
  modalPlanetName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#CCCCCC',
  },
  modalDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalStats: {
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  factsSection: {
    marginTop: 10,
  },
  factsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  factBullet: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 10,
    marginTop: 2,
  },
  factText: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
    lineHeight: 20,
  },
});

export default SolarSystemPlanets;