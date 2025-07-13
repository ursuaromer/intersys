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


// app/(tabs)/entretenimiento/_layout.tsx
import { Stack } from 'expo-router';

export default function EntretenimientoLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ Esto sí oculta el encabezado superior del stack local
      }}
    />
  );
}




