// import React from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';

// const { height } = Dimensions.get('window');

// type SpaceshipProps = {
//   x: number;
// };

// export default function Spaceship({ x }: SpaceshipProps) {
//   return (
//     <View style={[styles.shipContainer, { left: x - 25, top: height - 100 }]}>
//       {/* Cuerpo */}
//       <View style={styles.body} />
//       {/* Alas */}
//       <View style={styles.wingLeft} />
//       <View style={styles.wingRight} />
//       {/* Propulsor */}
//       <View style={styles.flame} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   shipContainer: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     alignItems: 'center',
//   },
//   body: {
//     width: 20,
//     height: 35,
//     backgroundColor: '#ccc',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   wingLeft: {
//     position: 'absolute',
//     left: 0,
//     top: 10,
//     width: 15,
//     height: 25,
//     backgroundColor: '#999',
//     transform: [{ rotate: '-20deg' }],
//   },
//   wingRight: {
//     position: 'absolute',
//     right: 0,
//     top: 10,
//     width: 15,
//     height: 25,
//     backgroundColor: '#999',
//     transform: [{ rotate: '20deg' }],
//   },
//   flame: {
//     marginTop: 2,
//     width: 10,
//     height: 15,
//     backgroundColor: 'deepskyblue',
//     borderRadius: 5,
//   },
// });





import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

type SpaceshipProps = {
  x: number;
};

export default function Spaceship({ x }: SpaceshipProps) {
  return (
    <Image
      source={require('@/assets/images/nave.png')} // Usa la ruta correcta
      style={[styles.ship, { left: x - 25, top: height - 100 }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  ship: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
});

