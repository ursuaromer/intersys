import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ScoreProps = {
  score: number;
};

export default function Score({ score }: ScoreProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Puntos: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,  // Un poco más abajo que las vidas
    left: 20,
    zIndex: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
