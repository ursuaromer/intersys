// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';

// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="inicio"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    // Opcional: añade tus fuentes si quieres
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: '#111' },
          drawerInactiveTintColor: '#ccc',
          drawerActiveTintColor: '#00f',
          drawerLabelStyle: { fontSize: 16 },
        }}
      >
        {/* Rutas de los archivos del menu lateral */}
        <Drawer.Screen name="inicio" options={{ title: 'Inicio' }} />
        <Drawer.Screen name="explore" options={{ title: 'Explorar' }} />
        <Drawer.Screen name="settings" options={{ title: 'Ajustes' }} />
      </Drawer>
    </>
  );
}
