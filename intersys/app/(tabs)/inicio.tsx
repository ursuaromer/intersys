import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NASA_API_KEY = 'sEs6pVAG8JlLgfh7fzJcVUiuFgdUcYECZqqWuCeB'; // Clave de mi api
const NASA_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

export default function HomeScreen() {
  const [nasaImage, setNasaImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(NASA_API_URL)
      .then((response) => response.json())
      .then((data) => {
        setNasaImage(data.url); // 📸 imagen del día
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar imagen de la NASA:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/* Menú superior */}
      {/* <View style={styles.topBar}>
        <Ionicons name="menu" size={32} color="white" />
        <Ionicons name="search" size={28} color="white" />
      </View> */}

      {/* Título */}
      <Text style={styles.title}>
        <Text style={styles.titleBlue}>Inter</Text>
        <Text style={styles.titleAccent}>SyS</Text>
      </Text>

      {/* Imagen dinámica desde NASA */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 20 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center' }}>Error al cargar la imagen</Text>
      ) : (
        <Image
          source={{ uri: nasaImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Texto descriptivo */}
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </Text>

      {/* Botón */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>EXPLORE THE{"\n"}UNIVERSE</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  titleBlue: {
    color: '#007BFF',
  },
  titleAccent: {
    color: '#fff',
    textShadowColor: '#007BFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 15,
    borderRadius: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    borderColor: '#007BFF',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#007BFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
