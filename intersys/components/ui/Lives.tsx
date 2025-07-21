import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import corazon from '@/assets/images/corazon.png';

type Props = {
  lives: number;
};

export default function Lives({ lives }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vidas:</Text>
      {Array.from({ length: lives }).map((_, index) => (
        <Image key={index} source={corazon} style={styles.heart} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    zIndex: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  heart: {
    width: 28,
    height: 24,
    marginRight: 5,
  },
});
