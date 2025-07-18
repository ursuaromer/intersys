// app/astros-gallery.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AstrosGallery from '../app/(tabs)/galeria/astros/AstrosGallery';

export default function AstrosGalleryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AstrosGallery />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
}); 