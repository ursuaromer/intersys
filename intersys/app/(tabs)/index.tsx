// // import { Image } from 'expo-image';
// // import { Platform, StyleSheet } from 'react-native';

// // import { HelloWave } from '@/components/HelloWave';
// // import ParallaxScrollView from '@/components/ParallaxScrollView';
// // import { ThemedText } from '@/components/ThemedText';
// // import { ThemedView } from '@/components/ThemedView';

// // export default function HomeScreen() {
// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         <ThemedText type="title">Welcome!</ThemedText>
// //         <HelloWave />
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //         <ThemedText>
// //           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //           Press{' '}
// //           <ThemedText type="defaultSemiBold">
// //             {Platform.select({
// //               ios: 'cmd + d',
// //               android: 'cmd + m',
// //               web: 'F12',
// //             })}
// //           </ThemedText>{' '}
// //           to open developer tools.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //         <ThemedText>
// //           {`Tap the Explore tab to learn more about what's included in this starter app.`}
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //         <ThemedText>
// //           {`When you're ready, run `}
// //           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //         </ThemedText>
// //       </ThemedView>
// //     </ParallaxScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// // });
// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const NASA_API_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB'; // Clave de mi api
// const NASA_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

// export default function HomeScreen() {
//   const [nasaImage, setNasaImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     fetch(NASA_API_URL)
//       .then((response) => response.json())
//       .then((data) => {
//         setNasaImage(data.url); // 📸 imagen del día
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error al cargar imagen de la NASA:', err);
//         setError(true);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Menú superior */}
//       {/* <View style={styles.topBar}>
//         <Ionicons name="menu" size={32} color="white" />
//         <Ionicons name="search" size={28} color="white" />
//       </View> */}

//       {/* Título */}
//       <Text style={styles.title}>
//         <Text style={styles.titleBlue}>Inter</Text>
//         <Text style={styles.titleAccent}>SyS</Text>
//       </Text>

//       {/* Imagen dinámica desde NASA */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 20 }} />
//       ) : error ? (
//         <Text style={{ color: 'red', textAlign: 'center' }}>Error al cargar la imagen</Text>
//       ) : (
//         <Image
//           source={{ uri: nasaImage }}
//           style={styles.image}
//           resizeMode="cover"
//         />
//       )}

//       {/* Texto descriptivo */}
//       <Text style={styles.description}>
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
//         labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
//         laboris nisi ut aliquip ex ea commodo consequat.
//       </Text>

//       {/* Botón */}
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>EXPLORE THE{"\n"}UNIVERSE</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   titleBlue: {
//     color: '#007BFF',
//   },
//   titleAccent: {
//     color: '#fff',
//     textShadowColor: '#007BFF',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginVertical: 15,
//     borderRadius: 8,
//   },
//   description: {
//     color: '#fff',
//     fontSize: 14,
//     lineHeight: 20,
//     textAlign: 'justify',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#000',
//     borderColor: '#007BFF',
//     borderWidth: 2,
//     borderRadius: 5,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   buttonText: {
//     color: '#007BFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/**
 * Componente principal de la pantalla de inicio
 * Muestra la imagen astronómica del día de la NASA
 */
const HomeScreen = () => {
  // Estados para manejar los datos de la API
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Tu API Key de NASA
  const NASA_API_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB';
  const APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';

  /**
   * Función para obtener la imagen astronómica del día
   * Hace una petición GET a la API de NASA APOD
   */
  const fetchAPOD = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${APOD_BASE_URL}?api_key=${NASA_API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApodData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching APOD:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect para cargar los datos cuando el componente se monta
   */
  useEffect(() => {
    fetchAPOD();
  }, []);

  /**
   * Función para manejar el retry cuando hay error
   */
  const handleRetry = () => {
    fetchAPOD();
  };

  /**
   * Función para manejar cuando la imagen se carga completamente
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  /**
   * Función para mostrar información adicional sobre la imagen
   */
  const showImageInfo = () => {
    if (apodData) {
      Alert.alert(
        'Información de la Imagen',
        `Título: ${apodData.title}\n\nFecha: ${apodData.date}\n\nCopyright: ${apodData.copyright || 'NASA'}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  /**
   * Renderizado del componente de carga
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#16213e']}
          style={styles.gradient}
        >
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Cargando imagen del cosmos...</Text>
        </LinearGradient>
      </View>
    );
  }

  /**
   * Renderizado del componente de error
   */
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#16213e']}
          style={styles.gradient}
        >
          <Text style={styles.errorText}>Error al cargar la imagen</Text>
          <Text style={styles.errorSubText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  /**
   * Renderizado principal del componente
   */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#0a0a0a', 'transparent']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>NASA Space Explorer</Text>
        <Text style={styles.headerSubtitle}>Imagen Astronómica del Día</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Contenedor principal de la imagen */}
        <View style={styles.imageContainer}>
          {apodData && (
            <>
              {/* Imagen principal con overlay */}
              <ImageBackground
                source={{ uri: apodData.url }}
                style={styles.backgroundImage}
                onLoad={handleImageLoad}
                resizeMode="cover"
              >
                {/* Overlay con gradiente */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.imageOverlay}
                />
                
                {/* Información sobre la imagen */}
                <View style={styles.imageInfo}>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={showImageInfo}
                  >
                    <Text style={styles.infoButtonText}>ℹ️</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>

              {/* Título y descripción */}
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{apodData.title}</Text>
                <Text style={styles.date}>{apodData.date}</Text>
                
                {/* Descripción con scroll */}
                <ScrollView 
                  style={styles.descriptionContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.description}>
                    {apodData.explanation}
                  </Text>
                </ScrollView>

                {/* Copyright si existe */}
                {apodData.copyright && (
                  <Text style={styles.copyright}>
                    © {apodData.copyright}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Botón flotante para refresh */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRetry}
      >
        <Text style={styles.refreshButtonText}>🔄</Text>
      </TouchableOpacity>
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
    backgroundColor: '#0a0a0a',
  },
  
  // Estilos para estado de carga
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '300',
  },
  
  // Estilos para estado de error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  errorSubText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Estilos del header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  
  headerSubtitle: {
    color: '#4a90e2',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '300',
  },
  
  // Estilos del scroll view
  scrollView: {
    flex: 1,
  },
  
  // Estilos del contenedor de imagen
  imageContainer: {
    flex: 1,
  },
  
  backgroundImage: {
    width: width,
    height: height * 0.6,
    justifyContent: 'flex-end',
  },
  
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  
  imageInfo: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  
  infoButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  infoButtonText: {
    fontSize: 18,
  },
  
  // Estilos del contenido
  contentContainer: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 30,
  },
  
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 30,
  },
  
  date: {
    color: '#4a90e2',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '400',
  },
  
  descriptionContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  
  description: {
    color: '#cccccc',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '300',
    textAlign: 'justify',
  },
  
  copyright: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Botón flotante de refresh
  refreshButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4a90e2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  refreshButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
});

export default HomeScreen;
