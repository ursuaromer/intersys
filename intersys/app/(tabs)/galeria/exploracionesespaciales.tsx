import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  StyleSheet,
  StatusBar,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const API_KEY = 'DEMO_KEY'; // Cambiado por seguridad

const SpaceExplorationGallery = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 0, name: 'APOD', icon: '🌌', title: 'Imagen del Día' },
    { id: 1, name: 'Mars', icon: '🔴', title: 'Mars Rover' },
    { id: 2, name: 'Earth', icon: '🌍', title: 'Tierra Espacial' },
    { id: 3, name: 'NEO', icon: '☄️', title: 'Asteroides' },
  ];

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (tabIndex) => {
    setLoading(true);
    try {
      let response;
      let processedData = [];

      switch (tabIndex) {
        case 0: // APOD
          try {
            response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=5`);
            if (response.ok) {
              const apodData = await response.json();
              processedData = apodData.map((item, index) => ({
                id: item.date || `apod-${index}`,
                title: item.title || 'Sin título',
                image: item.media_type === 'image' ? item.url : null,
                description: item.explanation || 'Sin descripción disponible',
                date: item.date || new Date().toISOString().split('T')[0],
                type: 'apod',
                isVideo: item.media_type === 'video',
                videoUrl: item.media_type === 'video' ? item.url : null,
              }));
            }
          } catch (error) {
            console.log('Error loading APOD, using fallback data');
          }
          
          // Datos de respaldo si la API falla
          if (processedData.length === 0) {
            processedData = [
              {
                id: 'apod-1',
                title: 'Galaxia de Andrómeda',
                image: 'https://apod.nasa.gov/apod/image/2301/M31_HubbleSpitzerGendler_2048.jpg',
                description: 'La galaxia de Andrómeda es la galaxia espiral más cercana a la Vía Láctea.',
                date: new Date().toISOString().split('T')[0],
                type: 'apod',
                isVideo: false,
              },
              {
                id: 'apod-2',
                title: 'Nebulosa del Cangrejo',
                image: 'https://apod.nasa.gov/apod/image/2301/CrabNebula_HubbleChandra_960.jpg',
                description: 'La Nebulosa del Cangrejo es un remanente de supernova visible en la constelación de Tauro.',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                type: 'apod',
                isVideo: false,
              }
            ];
          }
          break;

        case 1: // Mars Rover
          try {
            response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}&page=1`);
            if (response.ok) {
              const marsData = await response.json();
              processedData = (marsData.photos || []).slice(0, 10).map(photo => ({
                id: photo.id?.toString() || Math.random().toString(),
                title: photo.camera?.full_name || 'Cámara desconocida',
                image: photo.img_src,
                description: `Imagen capturada por el rover ${photo.rover?.name || 'Curiosity'} el ${photo.earth_date || 'fecha desconocida'} durante el sol ${photo.sol || '1000'} marciano usando la cámara ${photo.camera?.name || 'desconocida'}.`,
                date: photo.earth_date || new Date().toISOString().split('T')[0],
                type: 'mars',
                rover: photo.rover?.name || 'Curiosity',
                sol: photo.sol || 1000,
                camera: photo.camera?.full_name || 'Cámara desconocida',
              }));
            }
          } catch (error) {
            console.log('Error loading Mars data, using fallback');
          }
          
          // Datos de respaldo
          if (processedData.length === 0) {
            processedData = [
              {
                id: 'mars-1',
                title: 'Mars Hand Lens Imager',
                image: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ccam/CR0_486265253EDR_F0481570CCAM03000M_.JPG',
                description: 'Imagen capturada por el rover Curiosity en Marte durante el sol 1000 marciano.',
                date: '2015-05-31',
                type: 'mars',
                rover: 'Curiosity',
                sol: 1000,
                camera: 'Mars Hand Lens Imager',
              }
            ];
          }
          break;

        case 2: // Earth Images
          processedData = Array.from({ length: 6 }, (_, i) => ({
            id: `earth-${i}`,
            title: `Vista de la Tierra ${i + 1}`,
            image: `https://epic.gsfc.nasa.gov/archive/natural/2023/01/15/png/epic_1b_20230115${String(i).padStart(2, '0')}3518.png`,
            description: `Vista completa de la Tierra capturada por el satélite DSCOVR desde el punto Lagrange L1.`,
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            type: 'earth',
          }));
          break;

        case 3: // Near Earth Objects
          try {
            const today = new Date().toISOString().split('T')[0];
            response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&api_key=${API_KEY}`);
            if (response.ok) {
              const neoData = await response.json();
              const asteroids = [];
              
              if (neoData.near_earth_objects) {
                Object.values(neoData.near_earth_objects).forEach(dayAsteroids => {
                  asteroids.push(...dayAsteroids);
                });
              }
              
              processedData = asteroids.slice(0, 15).map((asteroid, index) => ({
                id: asteroid.id || `neo-${index}`,
                title: (asteroid.name || 'Asteroide desconocido').replace(/[()]/g, ''),
                image: null,
                description: `Diámetro estimado: ${Math.round(asteroid.estimated_diameter?.meters?.estimated_diameter_min || 100)}-${Math.round(asteroid.estimated_diameter?.meters?.estimated_diameter_max || 200)} metros. Velocidad: ${Math.round(parseFloat(asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 50000))} km/h`,
                date: asteroid.close_approach_data?.[0]?.close_approach_date || today,
                type: 'neo',
                distance: `${Math.round(parseFloat(asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 1000000)).toLocaleString()} km`,
                dangerous: asteroid.is_potentially_hazardous_asteroid || false,
                diameter: `${Math.round(asteroid.estimated_diameter?.meters?.estimated_diameter_min || 100)}-${Math.round(asteroid.estimated_diameter?.meters?.estimated_diameter_max || 200)}m`,
              }));
            }
          } catch (error) {
            console.log('Error loading NEO data, using fallback');
          }
          
          // Datos de respaldo
          if (processedData.length === 0) {
            processedData = [
              {
                id: 'neo-1',
                title: 'Asteroide Bennu',
                image: null,
                description: 'Diámetro estimado: 200-300 metros. Velocidad: 28,000 km/h',
                date: new Date().toISOString().split('T')[0],
                type: 'neo',
                distance: '4,500,000 km',
                dangerous: false,
                diameter: '200-300m',
              },
              {
                id: 'neo-2',
                title: 'Asteroide Apophis',
                image: null,
                description: 'Diámetro estimado: 325-375 metros. Velocidad: 30,000 km/h',
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                type: 'neo',
                distance: '31,000,000 km',
                dangerous: true,
                diameter: '325-375m',
              }
            ];
          }
          break;
      }

      setData(processedData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos. Verifica tu conexión.');
      console.error('Error loading data:', error);
      // Datos de respaldo básicos
      setData([
        {
          id: 'error-1',
          title: 'Error de conexión',
          image: null,
          description: 'No se pudieron cargar los datos. Por favor, verifica tu conexión a internet.',
          date: new Date().toISOString().split('T')[0],
          type: 'error',
        }
      ]);
    }
    setLoading(false);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderTabButton = ({ item }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === item.id && styles.activeTab]}
      onPress={() => setActiveTab(item.id)}
    >
      <LinearGradient
        colors={activeTab === item.id ? ['#3b82f6', '#1d4ed8'] : ['#374151', '#4b5563']}
        style={styles.tabGradient}
      >
        <Text style={styles.tabIcon}>{item.icon}</Text>
        <Text style={[styles.tabText, activeTab === item.id && styles.activeTabText]}>
          {item.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderGalleryItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <LinearGradient colors={['#1e293b', '#334155']} style={styles.cardGradient}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.cardImage}
            onError={() => console.log('Error loading image:', item.image)}
          />
        ) : (
          <LinearGradient
            colors={item.type === 'neo' ? ['#f59e0b', '#d97706'] : 
                    item.type === 'error' ? ['#ef4444', '#dc2626'] :
                    ['#3b82f6', '#1d4ed8']}
            style={styles.placeholderImage}
          >
            <Text style={styles.placeholderIcon}>
              {item.type === 'neo' ? '☄️' : 
               item.type === 'error' ? '⚠️' :
               item.isVideo ? '🎥' : '🌌'}
            </Text>
          </LinearGradient>
        )}
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.cardDate}>
            📅 {item.date}
          </Text>
          
          {item.type === 'neo' && (
            <View style={styles.asteroidInfo}>
              <Text style={styles.asteroidText}>
                📏 {item.diameter}
              </Text>
              <Text style={styles.asteroidText}>
                📍 {item.distance}
              </Text>
              <View style={[styles.dangerBadge, { backgroundColor: item.dangerous ? '#ef4444' : '#10b981' }]}>
                <Text style={styles.dangerText}>
                  {item.dangerous ? '⚠️ Peligroso' : '✅ Seguro'}
                </Text>
              </View>
            </View>
          )}
          
          {item.type === 'mars' && (
            <Text style={styles.roverInfo}>
              🤖 {item.rover} - Sol {item.sol}
            </Text>
          )}
          
          <Text style={styles.cardDescription} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.header}>
        <Text style={styles.headerTitle}>🚀 NASA Space Gallery</Text>
        <Text style={styles.headerSubtitle}>Exploraciones del Cosmos</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <FlatList
          data={tabs}
          renderItem={renderTabButton}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsList}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Cargando exploraciones...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderGalleryItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gallery}
        />
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient colors={['#1e293b', '#334155']} style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedItem && (
                <>
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  
                  {selectedItem.image && (
                    <Image
                      source={{ uri: selectedItem.image }}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  )}
                  
                  <Text style={styles.modalDate}>📅 {selectedItem.date}</Text>
                  
                  {selectedItem.type === 'neo' && (
                    <View style={styles.modalAsteroidInfo}>
                      <Text style={styles.modalInfoText}>📏 Diámetro: {selectedItem.diameter}</Text>
                      <Text style={styles.modalInfoText}>📍 Distancia: {selectedItem.distance}</Text>
                      <Text style={[styles.modalInfoText, { color: selectedItem.dangerous ? '#ef4444' : '#10b981' }]}>
                        {selectedItem.dangerous ? '⚠️ Potencialmente peligroso' : '✅ No es peligroso'}
                      </Text>
                    </View>
                  )}
                  
                  <Text style={styles.modalDescription}>
                    {selectedItem.description}
                  </Text>
                </>
              )}
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  tabContainer: {
    paddingVertical: 15,
  },
  tabsList: {
    paddingHorizontal: 15,
  },
  tabButton: {
    marginRight: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  tabGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  activeTab: {
    elevation: 5,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 15,
    fontSize: 16,
  },
  gallery: {
    padding: 15,
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardGradient: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 50,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 8,
  },
  cardDate: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 10,
  },
  cardDescription: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  asteroidInfo: {
    marginBottom: 10,
  },
  asteroidText: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 4,
  },
  dangerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  dangerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  roverInfo: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    borderRadius: 20,
    padding: 20,
    margin: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 15,
    marginTop: 10,
    paddingRight: 40,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalDate: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 15,
  },
  modalAsteroidInfo: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalInfoText: {
    color: '#e2e8f0',
    fontSize: 15,
    marginBottom: 5,
  },
  modalDescription: {
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SpaceExplorationGallery;