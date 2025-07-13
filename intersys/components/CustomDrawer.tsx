// components/CustomDrawer.tsx
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from 'expo-router';
import { useState } from "react";
import { useRouter } from "expo-router";
const CustomDrawer = (props: any) => {
  // const navigation = useNavigation();
  const [expanded, setExpanded] = useState({
    explorar: false,
    galeria: false,
    aprende: false,
    juego:false,
    acerca: false,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* Primer seccion */}
      <Section title="EXPLORAR UNIVERSO" onPress={() => toggle("explorar")} />
      {expanded.explorar && (
        <>
          <SubItem label="Planetas del Sistema Solar" route="/(tabs)/esploraruniverso/planetassistemasolar"  />
          <SubItem label="Estrellas y Galaxias" route="/(tabs)/esploraruniverso/estrellasygalaxias" />
          <SubItem label="Telescopios y Observatorios" route="/(tabs)/esploraruniverso/telescopioyobservatorios"/>
        </>
      )}
    {/* Segunda seccion */}
    <Section title="GALERÍA" onPress={() => toggle("galeria")} />
      {expanded.galeria && (
        <>
          <SubItem label="Astros" />
          <SubItem label="Planetas" />
          <SubItem label="Satélites" />
          <SubItem label="Galaxias" />
          <SubItem label="Exploraciones Espaciales" />
        </>
      )}
      {/* Tercera seccion */}
      <Section title="APRENDE CON NOSOTROS" onPress={() => toggle("aprende")} />
      {expanded.aprende && (
        <SubItem
          label="Pregunta y respuesta (Juego)"
          route="/aprendeconNosotros"
        />
      )}
      {/* Cuarta seccion */}

      <Section title="Juego" onPress={() => toggle("juego")} />
      {expanded.juego && (
        <SubItem
          label="Asteroide Storm"
          route="/(tabs)/juegos/asteroid-storm"
        />
      )}

      {/* Quinta seccion */}
      <Section title="ACERCA DE" onPress={() => toggle("acerca")} />
      {expanded.acerca && (
        <SubItem label="Detalles de la app" route="/acerca" />
      )}
    </DrawerContentScrollView>
  );
};

const Section = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.section}>
    <Text style={styles.sectionText}>{title}</Text>
  </TouchableOpacity>
);

const SubItem = ({ label, route }: { label: string; route?: string }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.subItem}
      onPress={() => {
        if (route) router.push(route);
      }}
    >
      <Text style={styles.subItemText}>{label}</Text>
    </TouchableOpacity>
  );
};

// ESTILOS DEL DRAWER
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#000",
  },
  section: {
    backgroundColor: "#00f",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  sectionText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subItem: {
    marginLeft: 16,
    marginVertical: 6,
  },
  subItemText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default CustomDrawer;
