// import { Link } from 'expo-router';
// import { View, Text, Pressable, StyleSheet } from 'react-native';

// export default function EntretenimientoIndex() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🎮 Juegos disponibles</Text>

//       <Link href="/(tabs)/entretenimiento/asteroid-storm" asChild>

//         <Pressable style={styles.button}>
//           <Text style={styles.buttonText}>Asteroid Storm</Text>
//         </Pressable>
//       </Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 26,
//     color: 'white',
//     marginBottom: 40,
//   },
//   button: {
//     backgroundColor: '#222',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#0af',
//   },
// });



import { Link } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function EntretenimientoIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Juegos disponibles</Text>

      <Link href="/(tabs)/juegos/asteroid-storm" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Asteroid Storm</Text>
        </Pressable>
      </Link>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: 'white',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#0af',
  },
});



