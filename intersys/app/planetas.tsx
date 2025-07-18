// app/planetas.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlanetsGallery from '../app/(tabs)/galeria/astros/PlanetsGallery';

const PlanetasScreen = () => {
  return (
    <View style={styles.container}>
      <PlanetsGallery />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default PlanetasScreen;