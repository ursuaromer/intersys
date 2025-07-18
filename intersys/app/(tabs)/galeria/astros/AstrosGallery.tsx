// app/(tabs)/galeria/astros/AstrosGallery.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
  Platform,
  Animated,
  PanResponder,
  SafeAreaView,
} from 'react-native';

interface AstroItem {
  date: string;
  explanation: string;
  media_type: string;
  title: string;
  url: string;
  hdurl?: string;
}

const { width, height } = Dimensions.get('window');

const AstrosGallery = () => {
  const [astros, setAstros] = useState<AstroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAstro, setSelectedAstro] = useState<AstroItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Tu API key personal
  const API_KEY = 'OWWf9TW4A3sgM1t8Xs3VCWhQHv9udhavoR3Keugz';

  // Cálculo responsive mejorado
  const getResponsiveLayout = () => {
    const screenWidth = width;
    const padding = 20;
    const itemSpacing = 12;
    
    let numColumns = 1;
    let itemWidth = screenWidth - (padding * 2);
    
    if (screenWidth >= 900) {
      numColumns = 4;
    } else if (screenWidth >= 700) {
      numColumns = 3;
    } else if (screenWidth >= 500) {
      numColumns = 2;
    } else {
      numColumns = 1;
    }
    
    if (numColumns > 1) {
      const availableWidth = screenWidth - (padding * 2) - (itemSpacing * (numColumns - 1));
      itemWidth = availableWidth / numColumns;
    }
    
    return { numColumns, itemWidth, itemSpacing };
  };

  const { numColumns, itemWidth, itemSpacing } = getResponsiveLayout();

  useEffect(() => {
    fetchAstrosData();
    startHeaderAnimation();
    startPulseAnimation();
  }, []);

  const startHeaderAnimation = () => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchAstrosData = async () => {
    try {
      setLoading(true);
      const astrosData: AstroItem[] = [];
      const today = new Date();
      
      for (let i = 0; i < 20; i++) {
        try {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          
          const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${dateString}`
          );
          
          if (!response.ok) {
            console.warn(`Error fetching data for ${dateString}:`, response.status);
            continue;
          }
          
          const data = await response.json();
          
          if (data.media_type === 'image' && data.url) {
            astrosData.push(data);
          }
          
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error) {
          console.warn(`Error fetching data for day ${i}:`, error);
          continue;
        }
      }
      
      setAstros(astrosData);
      
      if (astrosData.length === 0) {
        Alert.alert('🌌 Aviso', 'No se pudieron cargar imágenes en este momento. Intenta más tarde.');
      }
      
    } catch (error) {
      console.error('Error fetching astros data:', error);
      Alert.alert('❌ Error', 'No se pudieron cargar las imágenes de astros');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAstrosData();
  };

  const handleImageError = (date: string) => {
    setImageLoadErrors(prev => new Set([...prev, date]));
  };

  const openModal = (astro: AstroItem) => {
    setSelectedAstro(astro);
    setCurrentImageIndex(astros.findIndex(item => item.date === astro.date));
    setModalVisible(true);
    
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedAstro(null);
    });
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % astros.length
      : (currentImageIndex - 1 + astros.length) % astros.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedAstro(astros[newIndex]);
  };

  const renderAstroItem = ({ item, index }: { item: AstroItem; index: number }) => {
    const hasError = imageLoadErrors.has(item.date);
    
    return (
      <Animated.View 
        style={[
          styles.astroItem, 
          { 
            width: itemWidth,
            opacity: fadeAnim,
            transform: [{ 
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }
        ]}
      >
        <TouchableOpacity 
          onPress={() => openModal(item)}
          activeOpacity={0.9}
          style={styles.touchableItem}
        >
          <View style={styles.imageContainer}>
            {hasError ? (
              <View style={styles.errorContainer}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Text style={styles.errorIcon}>🌌</Text>
                </Animated.View>
                <Text style={styles.errorMessage}>No disponible</Text>
              </View>
            ) : (
              <>
                <Image 
                  source={{ uri: item.url }} 
                  style={styles.astroImage}
                  resizeMode="cover"
                  onError={() => handleImageError(item.date)}
                />
                <View style={styles.imageOverlay}>
                  <View style={styles.overlayGradient} />
                  <View style={styles.overlayContent}>
                    <Text style={styles.overlayTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.overlayDate}>
                      {new Date(item.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
          
          <View style={styles.astroInfo}>
            <View style={styles.infoHeader}>
              <Text style={styles.astroTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.dateTag}>
                <Text style={styles.astroDate}>
                  {new Date(item.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </Text>
              </View>
            </View>
            <Text style={styles.astroDescription} numberOfLines={3}>
              {item.explanation}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSeparator = () => (
    <View style={{ height: itemSpacing }} />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContent}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={styles.loadingIcon}>🚀</Text>
          </Animated.View>
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Explorando el cosmos...</Text>
          <Text style={styles.loadingSubtext}>Cargando imágenes astronómicas desde la NASA</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header mejorado */}
      <Animated.View 
        style={[
          styles.headerContainer,
          { transform: [{ translateY: headerAnim }] }
        ]}
      >
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={styles.headerIcon}>🌌</Text>
          </Animated.View>
          <Text style={styles.headerTitle}>GALERÍA ASTROS</Text>
          <Text style={styles.headerSubtitle}>Imágenes astronómicas • NASA APOD</Text>
          <View style={styles.headerDivider} />
        </View>
      </Animated.View>
      
      <FlatList
        data={astros}
        renderItem={renderAstroItem}
        keyExtractor={(item) => item.date}
        numColumns={numColumns}
        key={`${numColumns}-${width}`}
        contentContainerStyle={styles.galleryContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={renderSeparator}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        onScrollBeginDrag={() => {
          // Añadir feedback háptico si está disponible
        }}
      />

      {/* Modal completamente rediseñado */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Animated.View 
          style={[
            styles.modalBackground,
            {
              opacity: modalAnim,
              transform: [{ 
                scale: modalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }]
            }
          ]}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.navButton} onPress={() => navigateImage('prev')}>
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              
              <View style={styles.modalCounter}>
                <Text style={styles.counterText}>
                  {currentImageIndex + 1} de {astros.length}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.navButton} onPress={() => navigateImage('next')}>
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            
            <ScrollView
              contentContainerStyle={styles.modalContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {selectedAstro && (
                <>
                  <View style={styles.modalImageContainer}>
                    <Image
                      source={{ uri: selectedAstro.hdurl || selectedAstro.url }}
                      style={styles.modalImage}
                      resizeMode="contain"
                      onError={() => console.warn('Error loading modal image')}
                    />
                    <View style={styles.modalImageOverlay}>
                      <Text style={styles.modalImageTitle}>
                        {selectedAstro.title}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfo}>
                    <View style={styles.modalTitleContainer}>
                      <Text style={styles.modalTitle}>
                        {selectedAstro.title}
                      </Text>
                      <View style={styles.modalDateContainer}>
                        <Text style={styles.modalDateIcon}>📅</Text>
                        <Text style={styles.modalDate}>
                          {new Date(selectedAstro.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.explanationContainer}>
                      <View style={styles.explanationHeader}>
                        <Text style={styles.explanationIcon}>📖</Text>
                        <Text style={styles.explanationTitle}>Descripción</Text>
                      </View>
                      <Text style={styles.modalExplanation}>
                        {selectedAstro.explanation}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: '#000',
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.9,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#4A90E2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  headerDivider: {
    width: 80,
    height: 3,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  galleryContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
  },
  astroItem: {
    backgroundColor: '#111',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 0,
  },
  touchableItem: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: width > 768 ? 200 : width > 480 ? 180 : 160,
  },
  astroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayContent: {
    position: 'relative',
    padding: 15,
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  overlayDate: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  errorMessage: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  astroInfo: {
    padding: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  astroTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
  },
  dateTag: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  astroDate: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  astroDescription: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'justify',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingSpinner: {
    marginVertical: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  navButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  navButtonText: {
    color: '#4A90E2',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalImageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    marginBottom: 25,
  },
  modalImage: {
    width: '100%',
    height: height * 0.45,
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  modalImageTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalInfo: {
    flex: 1,
  },
  modalTitleContainer: {
    marginBottom: 25,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  modalDateIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  modalDate: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  explanationContainer: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  explanationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  explanationTitle: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalExplanation: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});
export default AstrosGallery