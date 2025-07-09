// // import { Tabs } from 'expo-router';
// // import React from 'react';
// // import { Platform } from 'react-native';

// // import { HapticTab } from '@/components/HapticTab';
// // import { IconSymbol } from '@/components/ui/IconSymbol';
// // import TabBarBackground from '@/components/ui/TabBarBackground';
// // import { Colors } from '@/constants/Colors';
// // import { useColorScheme } from '@/hooks/useColorScheme';

// // export default function TabLayout() {
// //   const colorScheme = useColorScheme();

// //   return (
// //     <Tabs
// //       screenOptions={{
// //         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
// //         headerShown: false,
// //         tabBarButton: HapticTab,
// //         tabBarBackground: TabBarBackground,
// //         tabBarStyle: Platform.select({
// //           ios: {
// //             // Use a transparent background on iOS to show the blur effect
// //             position: 'absolute',
// //           },
// //           default: {},
// //         }),
// //       }}>
// //       <Tabs.Screen
// //         name="inicio"
// //         options={{
// //           title: 'Home',
// //           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
// //         }}
// //       />
// //       <Tabs.Screen
// //         name="explore"
// //         options={{
// //           title: 'Explore',
// //           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
// //         }}
// //       />
// //     </Tabs>
// //   );
// // }
// // app/_layout.tsx
// import { Drawer } from 'expo-router/drawer';
// import { useFonts } from 'expo-font';
// import { StatusBar } from 'expo-status-bar';

// export default function Layout() {
//   const [fontsLoaded] = useFonts({
//     // Opcional: añade tus fuentes si quieres
//   });

//   if (!fontsLoaded) return null;

//   return (
//     <>
//       <StatusBar style="light" />
//       <Drawer
//         screenOptions={{
//           headerStyle: { backgroundColor: '#000' },
//           headerTintColor: '#fff',
//           drawerStyle: { backgroundColor: '#111' },
//           drawerInactiveTintColor: '#ccc',
//           drawerActiveTintColor: '#00f',
//           drawerLabelStyle: { fontSize: 16 },
//         }}
//       >
// {/* *************************************AQUI ES DONDE SE IMPORTAN LOS COMPONENTES PARA EL SIDEBAR**************************** */}
//         {/* Rutas de los archivos del menu lateral */}
//         <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
//         <Drawer.Screen name="inicio" options={{ title: 'Explorar Universo' }} />
//         <Drawer.Screen name="explore" options={{ title: 'Galeria' }} />
//         <Drawer.Screen name="aprendeconNosotros" options={{ title: 'Aprende Con Nosotros' }} />
//         <Drawer.Screen name="acerca" options={{ title: 'Acerca De' }} />
//       </Drawer>
//     </>
//   );
// }


// Opcion 3
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { useState } from 'react';
import CustomDrawer from '@/components/CustomDrawer';

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#000',
        },
        drawerLabelStyle: {
          color: '#fff',
        },
      }}
    />
  );
}
