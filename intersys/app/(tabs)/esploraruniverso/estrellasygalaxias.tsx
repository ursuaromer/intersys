import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Constantes para la API de la NASA
const NASA_API_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB';
const NASA_API_BASE_URL = 'https://api.nasa.gov/planetary/apod';

/**
 * Componente principal para mostrar estrellas y galaxias
 * Utiliza la API APOD (Astronomy Picture of the Day) de la NASA
 */
const SpaceGalleryComponent = () => {
  // Estados para manejar los datos y UI
  const [spaceData, setSpaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Función para obtener datos de la API de la NASA
   * Obtiene las últimas 10 imágenes astronómicas
   */
  const fetchSpaceData = async () => {
    try {
      // Calculamos las fechas para obtener las últimas 10 imágenes
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 9);

      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      const response = await fetch(
        `${NASA_API_BASE_URL}?api_key=${NASA_API_KEY}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener datos de la NASA');
      }

      const data = await response.json();
      
      // Filtramos solo las imágenes (no videos) y las ordenamos por fecha
      const filteredData = data
        .filter(item => item.media_type === 'image')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setSpaceData(filteredData);
    } catch (error) {
      console.error('Error fetching space data:', error);
      Alert.alert('Error', 'No se pudieron cargar las imágenes del espacio');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Función para manejar el refresh (pull to refresh)
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchSpaceData();
  };

  /**
   * Función para abrir el modal con detalles de la imagen
   */
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  /**
   * Función para cerrar el modal
   */
  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  /**
   * Función para formatear la fecha
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Componente para renderizar cada item de la galería
   */
  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() => openModal(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.3)']}
        style={styles.gradientOverlay}
      >
        <Image
          source={{ uri: item.url }}
          style={styles.galleryImage}
          resizeMode="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemDate}>
            {formatDate(item.date)}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  /**
   * Componente del modal para mostrar detalles completos
   */
  const DetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#16213e']}
          style={styles.modalContent}
        >
          {selectedItem && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header del modal */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Imagen principal */}
              <Image
                source={{ uri: selectedItem.url }}
                style={styles.modalImage}
                resizeMode="cover"
              />

              {/* Información de la imagen */}
              <View style={styles.modalInfo}>
                <Text style={styles.modalTitle}>
                  {selectedItem.title}
                </Text>
                <Text style={styles.modalDate}>
                  {formatDate(selectedItem.date)}
                </Text>
                <Text style={styles.modalExplanation}>
                  {selectedItem.explanation}
                </Text>
                
                {/* Copyright si existe */}
                {selectedItem.copyright && (
                  <Text style={styles.modalCopyright}>
                    © {selectedItem.copyright}
                  </Text>
                )}
              </View>
            </ScrollView>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    fetchSpaceData();
  }, []);

  // Pantalla de carga
  if (loading) {
    return (
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#64b5f6" />
        <Text style={styles.loadingText}>Cargando el universo...</Text>
      </LinearGradient>
    );
  }

  return (
    <>
           <Stack.Screen options={{ title: "Estrellas y galaxias", headerShown: true }} />

    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#16213e']}
      style={styles.container}
    > 
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galaxias y Estrellas</Text>
        <Text style={styles.headerSubtitle}>NASA - Astronomía del Día</Text>
      </View>

      {/* Galería de imágenes */}
      <FlatList
        data={spaceData}
        renderItem={renderGalleryItem}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.galleryContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#64b5f6']}
            progressBackgroundColor="#1a1a2e"
          />
        }
      />

      {/* Modal de detalles */}
      <DetailModal />
    </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '300',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#64b5f6',
    fontSize: 16,
    fontWeight: '300',
  },
  galleryContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  galleryItem: {
    flex: 1,
    margin: 5,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  galleryImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  itemInfo: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  itemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDate: {
    color: '#64b5f6',
    fontSize: 12,
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalImage: {
    width: width,
    height: height * 0.4,
    marginBottom: 20,
  },
  modalInfo: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDate: {
    color: '#64b5f6',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '300',
  },
  modalExplanation: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalCopyright: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default SpaceGalleryComponent;