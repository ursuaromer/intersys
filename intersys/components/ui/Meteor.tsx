// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// type MeteorProps = {
//   x: number;
//   y: number;
// };

// export default function Meteor({ x, y }: MeteorProps) {
//   return (
//     <View style={[styles.meteor, { left: x, top: y }]} />
//   );
// }

// const styles = StyleSheet.create({
//   meteor: {
//     position: 'absolute',
//     width: 30,
//     height: 30,
//     backgroundColor: 'red',
//     borderRadius: 15,
//   },
// });





// import React from 'react';
// import { Image, StyleSheet } from 'react-native';

// type MeteorProps = {
//   x: number;
//   y: number;
// };

// export default function Meteor({ x, y }: MeteorProps) {
//   return (
//     <Image
//       source={require('@/assets/images/meteorito1.png')} // ✅ Asegúrate que esta ruta sea correcta
//       style={[styles.meteor, { left: x, top: y }]}
//       resizeMode="contain"
//     />
//   );
// }

// const styles = StyleSheet.create({
//   meteor: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//   },
// });









// import React from 'react';
// import { Image, StyleSheet } from 'react-native';

// type MeteorProps = {
//   x: number;
//   y: number;
//   source: any;
// };

// export default function Meteor({ x, y, source }: MeteorProps) {
//   return (
//     <Image
//       source={source}
//       style={[styles.meteor, { left: x, top: y }]}
//       resizeMode="contain"
//     />
//   );
// }

// const styles = StyleSheet.create({
//   meteor: {
//     position: 'absolute',
//     width: 50,
//     height: 50,
//   },
// });




import React from 'react';
import { Image, StyleSheet } from 'react-native';

type MeteorProps = {
  x: number;
  y: number;
  source: any;
};

export default function Meteor({ x, y, source }: MeteorProps) {
  return (
    <Image source={source} style={[styles.meteor, { left: x, top: y }]} />
  );
}

const styles = StyleSheet.create({
  meteor: {
    position: 'absolute',
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
});



