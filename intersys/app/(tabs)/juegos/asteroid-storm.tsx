// import { StyleSheet, View } from 'react-native';
// import MeteorGame from '@/components/ui/MeteorGame';

// export default function ExploreScreen() {
//   return (
//     <View style={styles.container}>
//       <MeteorGame />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
// });




// import { StyleSheet, View } from 'react-native';
// import MeteorGame from '@/components/ui/MeteorGame';

// export default function AsteroidStormScreen() {
//   return (
//     <View style={styles.container}>
//       <MeteorGame />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
// });




// import { Stack } from 'expo-router';
// import { StyleSheet, View } from 'react-native';
// import MeteorGame from '@/components/ui/MeteorGame';



// export default function AsteroidStormScreen() {
//   return (
//     <View style={styles.container}>
//       <MeteorGame />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
// });




import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MeteorGame from '@/components/ui/MeteorGame';

export default function AsteroidStormScreen() {
  const [gameKey, setGameKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // Cada vez que se enfoca la pantalla, reinicia el juego
      setGameKey(prev => prev + 1);
    }, [])
  );

  return (
    <View style={styles.container}>
      <MeteorGame key={gameKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});


