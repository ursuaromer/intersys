// import { Stack } from 'expo-router';

// export default function EntretenimientoLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: { backgroundColor: '#000' },
//         headerTintColor: '#fff',
//         contentStyle: { backgroundColor: '#000' },
//       }}
//     />
//   );
// }


// app/(tabs)/juegos/_layout.tsx





// import { Stack } from 'expo-router';

// export default function EntretenimientoLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false, // ✅ Esto sí oculta el encabezado superior del stack local
//       }}
//     />
//   );
// }



import { Stack } from 'expo-router';

export default function JuegosLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: '🎮 Juegos' }} />
      <Stack.Screen name="asteroid-storm" options={{ headerShown: false }} />
    </Stack>
  );
}



