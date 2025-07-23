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

// WelcomeScreen.tsx
import React from 'react';
import { Text, TouchableOpacity, StatusBar, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  
  const handleContinue = () => {
    navigation.navigate('home');
  };
  
  return (
    <LinearGradient 
      colors={['#0f0f23', '#1a1a2e', '#16213e', '#0f3460']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundElements}>
        <View style={[styles.star, styles.star1]} />
        <View style={[styles.star, styles.star2]} />
        <View style={[styles.star, styles.star3]} />
        <View style={[styles.star, styles.star4]} />
        <View style={[styles.star, styles.star5]} />
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>🚀</Text>
          <Text style={styles.title}>Space Explorer</Text>
          <View style={styles.titleUnderline} />
        </View>
        
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Descubre el cosmos con la{' '}
            <Text style={styles.highlightText}>Imagen Astronómica del Día</Text>
            {' '}de la NASA
          </Text>
          <Text style={styles.description}>
            Sumérgete en las maravillas del universo, actualizadas diariamente con contenido exclusivo y fascinante.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4a90e2', '#357abd', '#2563eb']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonIcon}>🌌</Text>
            <Text style={styles.buttonText}>Explorar el Universo</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>✨ Una experiencia cósmica te espera</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  star1: {
    width: 3,
    height: 3,
    top: '15%',
    left: '20%',
    opacity: 0.8,
  },
  star2: {
    width: 2,
    height: 2,
    top: '25%',
    right: '15%',
    opacity: 0.6,
  },
  star3: {
    width: 4,
    height: 4,
    top: '35%',
    left: '80%',
    opacity: 0.9,
  },
  star4: {
    width: 2,
    height: 2,
    bottom: '30%',
    left: '10%',
    opacity: 0.7,
  },
  star5: {
    width: 3,
    height: 3,
    bottom: '20%',
    right: '25%',
    opacity: 0.8,
  },
  orb: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  orb1: {
    width: 120,
    height: 120,
    backgroundColor: '#4a90e2',
    top: '10%',
    right: '-10%',
  },
  orb2: {
    width: 80,
    height: 80,
    backgroundColor: '#2563eb',
    bottom: '15%',
    left: '-5%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 80,
    height: 3,
    backgroundColor: '#4a90e2',
    marginTop: 12,
    borderRadius: 2,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 18,
    color: '#e8e8e8',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
    fontWeight: '600',
  },
  highlightText: {
    color: '#4a90e2',
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    color: '#b8b8b8',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.85,
  },
  button: {
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 30,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 32,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#8888aa',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});

export default WelcomeScreen;