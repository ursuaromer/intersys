// app/(tabs)/galeria/satelites/SatellitesGallery.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {Stack} from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Satellite {
  id: string;
  name: string;
  image: string;
  description: string;
  launchDate: string;
  country: string;
  purpose: string;
  status: string;
}

const SatellitesGallery = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSatellites();
  }, []);

  const fetchSatellites = async () => {
    try {
      setLoading(true);
      
      const API_KEY = 'poN4CMjTWpgoSW6P1g5qzSVX6SuJ1jhS7wbiFa1X';
      
      // Obtener imágenes de satélites desde NASA API
      const [apodResponse, iotdResponse] = await Promise.all([
        // APOD (Astronomy Picture of the Day) - filtrar solo imágenes de satélites
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=15`),
        // NASA Image and Video Library - buscar específicamente satélites
        fetch(`https://images-api.nasa.gov/search?q=satellite%20orbit%20communication&media_type=image&page_size=20`)
      ]);

      const apodData = await apodResponse.json();
      const iotdData = await iotdResponse.json();

      // Datos de satélites reales (solo satélites, no exploraciones)
      const satellitesData: Satellite[] = [
        {
          id: '1',
          name: 'Telescopio Espacial Hubble',
          image: 'https://science.nasa.gov/wp-content/uploads/2023/06/hubble-in-safe-mode-due-to-ongoing-gyroscope-issue.jpg',
          description: 'El Telescopio Espacial Hubble es un satélite astronómico que orbita en el exterior de la atmósfera terrestre, proporcionando imágenes del universo sin la distorsión atmosférica.',
          launchDate: '24 de abril de 1990',
          country: 'Estados Unidos',
          purpose: 'Observación astronómica',
          status: 'Activo'
        },
        {
          id: '2',
          name: 'Telescopio Espacial James Webb',
          image: 'https://science.nasa.gov/wp-content/uploads/2023/09/webb-first-deep-field-smacs-0723-5mb.jpg',
          description: 'El telescopio espacial más poderoso jamás construido, un satélite diseñado para observar el universo en infrarrojo y estudiar la formación de las primeras galaxias.',
          launchDate: '25 de diciembre de 2021',
          country: 'Estados Unidos',
          purpose: 'Observación astronómica infrarroja',
          status: 'Activo'
        },
        {
          id: '3',
          name: 'Satélite Landsat 9',
          image: 'https://landsat.gsfc.nasa.gov/wp-content/uploads/2021/03/Landsat9_onOrbit_print-scaled.jpg',
          description: 'Satélite de observación terrestre que proporciona imágenes continuas de la superficie de la Tierra para el monitoreo de cambios ambientales.',
          launchDate: '27 de septiembre de 2021',
          country: 'Estados Unidos',
          purpose: 'Observación terrestre',
          status: 'Activo'
        },
        {
          id: '4',
          name: 'Satélite GOES-18',
          image: 'https://www.goes-r.gov/multimedia/dataAndImagery/imagery/GOES-18-first-light-full-disk-geocolor-may-11-2022.jpg',
          description: 'Satélite meteorológico geoestacionario que monitorea el clima y proporciona pronósticos meteorológicos en tiempo real.',
          launchDate: '1 de marzo de 2022',
          country: 'Estados Unidos',
          purpose: 'Monitoreo meteorológico',
          status: 'Activo'
        },
        {
          id: '5',
          name: 'Satélite Sentinel-1A',
          image: 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2014/04/sentinel-1a/14496204-1-eng-GB/Sentinel-1A_pillars.jpg',
          description: 'Satélite de radar europeo que proporciona imágenes de la Tierra independientemente de las condiciones meteorológicas.',
          launchDate: '3 de abril de 2014',
          country: 'Europa (ESA)',
          purpose: 'Observación radar terrestre',
          status: 'Activo'
        },
        {
          id: '6',
          name: 'Satélite GPS III',
          image: 'https://www.lockheedmartin.com/content/dam/lockheed-martin/space/photo/gps/GPS-III-SV01-on-orbit-illustration.jpg',
          description: 'Satélite de navegación que forma parte de la constelación GPS para proporcionar servicios de posicionamiento global.',
          launchDate: '23 de diciembre de 2018',
          country: 'Estados Unidos',
          purpose: 'Navegación y posicionamiento',
          status: 'Activo'
        },
        {
          id: '7',
          name: 'Satélite Starlink',
          image: 'https://cdn.mos.cms.futurecdn.net/6nVBYn7rWzTvPGUKPfBGnf.jpg',
          description: 'Satélite de comunicaciones de órbita baja que forma parte de la constelación Starlink para proporcionar internet de banda ancha.',
          launchDate: '24 de mayo de 2019',
          country: 'Estados Unidos',
          purpose: 'Comunicaciones e internet',
          status: 'Activo'
        },
        {
          id: '8',
          name: 'Satélite TESS',
          image: 'https://science.nasa.gov/wp-content/uploads/2023/09/tess-artist-concept.jpg',
          description: 'Satélite cazador de exoplanetas que busca planetas transitando frente a estrellas brillantes cercanas.',
          launchDate: '18 de abril de 2018',
          country: 'Estados Unidos',
          purpose: 'Búsqueda de exoplanetas',
          status: 'Activo'
        },
        {
          id: '9',
          name: 'Satélite Kepler',
          image: 'https://science.nasa.gov/wp-content/uploads/2023/09/kepler-spacecraft-artist-concept.jpg',
          description: 'Satélite espacial que buscó planetas similares a la Tierra orbitando otras estrellas en nuestra galaxia.',
          launchDate: '7 de marzo de 2009',
          country: 'Estados Unidos',
          purpose: 'Búsqueda de exoplanetas',
          status: 'Completada (2018)'
        },
        {
          id: '10',
          name: 'Satélite Aqua',
          image: 'https://terra.nasa.gov/images/aqua-satellite.jpg',
          description: 'Satélite de observación terrestre que estudia los océanos, la atmósfera y el ciclo del agua de la Tierra.',
          launchDate: '4 de mayo de 2002',
          country: 'Estados Unidos',
          purpose: 'Observación terrestre y océanos',
          status: 'Activo'
        }
      ];

      // Agregar imágenes dinámicas de APOD si están disponibles y son relacionadas con satélites
      if (apodData && Array.isArray(apodData)) {
        apodData.slice(0, 3).forEach((item, index) => {
          if (item.media_type === 'image' && 
              (item.title?.toLowerCase().includes('satellite') || 
               item.title?.toLowerCase().includes('space telescope') ||
               item.explanation?.toLowerCase().includes('satellite'))) {
            satellitesData.push({
              id: `apod-${index}`,
              name: item.title || `Satélite ${index + 1}`,
              image: item.url || item.hdurl,
              description: item.explanation || 'Satélite de la galería NASA.',
              launchDate: item.date || 'Fecha desconocida',
              country: 'Estados Unidos',
              purpose: 'Observación espacial',
              status: 'Archivo NASA'
            });
          }
        });
      }

      // Agregar imágenes específicas de satélites de la NASA Image Library
      if (iotdData && iotdData.collection && iotdData.collection.items) {
        iotdData.collection.items.slice(0, 3).forEach((item, index) => {
          if (item.links && item.links[0] && item.data[0]) {
            satellitesData.push({
              id: `nasa-satellite-${index}`,
              name: item.data[0].title || `Satélite ${index + 1}`,
              image: item.links[0].href,
              description: item.data[0].description || 'Satélite de la biblioteca NASA.',
              launchDate: item.data[0].date_created || 'Fecha desconocida',
              country: 'Estados Unidos',
              purpose: 'Satélite de comunicaciones/observación',
              status: 'Archivo NASA'
            });
          }
        });
      }

      setSatellites(satellitesData);
    } catch (error) {
      console.error('Error fetching satellites:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (satellite: Satellite) => {
    setSelectedSatellite(satellite);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSatellite(null);
  };

  const renderSatellite = ({ item }: { item: Satellite }) => (
    <TouchableOpacity
      style={styles.satelliteCard}
      onPress={() => openModal(item)}
    >
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.cardGradient}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.satelliteImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.satelliteName}>{item.name}</Text>
          <Text style={styles.satelliteCountry}>{item.country}</Text>
          <Text style={styles.satelliteStatus}>
            Estado: {item.status}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#0c0c0c', '#1a1a1a']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Cargando satélites...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <> 
          <Stack.Screen options={{ title: "Detalles de la App", headerShown: true }} />

       <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0c0c0c', '#1a1a1a']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🛰️ Galería de Satélites</Text>
        </View>

        {/* Galería */}
        <FlatList
          data={satellites}
          renderItem={renderSatellite}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gallery}
          showsVerticalScrollIndicator={false}
        />

        {/* Modal de detalles */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#1e3c72', '#2a5298']}
                style={styles.modalGradient}
              >
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

                {selectedSatellite && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Image
                      source={{ uri: selectedSatellite.image }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                    <View style={styles.modalInfo}>
                      <Text style={styles.modalTitle}>{selectedSatellite.name}</Text>
                      <Text style={styles.modalDescription}>
                        {selectedSatellite.description}
                      </Text>
                      
                      <View style={styles.detailsContainer}>
                        <DetailRow label="Fecha de lanzamiento:" value={selectedSatellite.launchDate} />
                        <DetailRow label="País:" value={selectedSatellite.country} />
                        <DetailRow label="Propósito:" value={selectedSatellite.purpose} />
                        <DetailRow label="Estado:" value={selectedSatellite.status} />
                      </View>
                    </View>
                  </ScrollView>
                )}
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
    </>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  gallery: {
    padding: 10,
  },
  satelliteCard: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 15,
  },
  satelliteImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
  satelliteName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  satelliteCountry: {
    color: '#b0b0b0',
    fontSize: 14,
    marginBottom: 5,
  },
  satelliteStatus: {
    color: '#4CAF50',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  detailLabel: {
    color: '#b0b0b0',
    fontSize: 14,
    fontWeight: 'bold',
    width: 120,
    flexShrink: 0,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});

export default SatellitesGallery;