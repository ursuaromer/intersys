

// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '@/components/CustomDrawer';

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#000',
        },
        drawerLabelStyle: {
          color: '#fff',
        },
      }}
    >
      {/* <Drawer.Screen
        name="juegos"
        options={{
          headerShown: true,
          title: 'Juegos',
        }}
      />
      <Drawer.Screen
        name="esploraruniverso"
        options={{
          // headerShown: true,
          title: 'Explorar Universo',
        }}
      />
      <Drawer.Screen
        name="aprendeconnosotros"
        options={{
          headerShown: false,
          title: 'Aprende con Nosotros',
        }}
      /> */}
    </Drawer>
  );
}
