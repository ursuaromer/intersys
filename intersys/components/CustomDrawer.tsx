// components/CustomDrawer.tsx
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const CustomDrawer = (props: any) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState({
    explorar: false,
    galeria: false,
    aprende: false,
    juego: false,
    acerca: false,
  });

  const animatedValues = useRef({
    explorar: new Animated.Value(0),
    galeria: new Animated.Value(0),
    aprende: new Animated.Value(0),
    juego: new Animated.Value(0),
    acerca: new Animated.Value(0),
  }).current;

  const toggle = (key: string) => {
    const isExpanded = expanded[key];
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    
    Animated.timing(animatedValues[key], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const navigateToHome = () => {
    router.push("/(tabs)/home");
  };



  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerText}>🌌 INTERSYS SPACE</Text>
      </LinearGradient>

      {/* Botón de Inicio */}
      <TouchableOpacity onPress={navigateToHome} style={styles.homeButton}>
        <LinearGradient
          colors={['#11998e', '#38ef7d']}
          style={styles.homeButtonGradient}
        >
          <Text style={styles.homeButtonText}>INICIO</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Secciones expandibles */}
      <Section 
        title="🌟 EXPLORAR UNIVERSO" 
        onPress={() => toggle("explorar")} 
        expanded={expanded.explorar}
      />
      <Animated.View style={[
        styles.submenuContainer,
        {
          maxHeight: animatedValues.explorar.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
          opacity: animatedValues.explorar,
        }
      ]}>
        {expanded.explorar && (
          <View style={styles.submenu}>
            <SubItem 
              label="Planetas del Sistema Solar" 
              route="/(tabs)/esploraruniverso/planetassistemasolar"
              icon="🪐"
            />
            <SubItem 
              label="Estrellas y Galaxias" 
              route="/(tabs)/esploraruniverso/estrellasygalaxias"
              icon="⭐"
            />
            <SubItem 
              label="Telescopios y Observatorios" 
              route="/(tabs)/esploraruniverso/telescopioyobservatorios"
              icon="🔭"
            />
          </View>
        )}
      </Animated.View>

      <Section 
        title="🖼️ GALERÍA" 
        onPress={() => toggle("galeria")} 
        expanded={expanded.galeria}
      />
      <Animated.View style={[
        styles.submenuContainer,
        {
          maxHeight: animatedValues.galeria.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 250],
          }),
          opacity: animatedValues.galeria,
        }
      ]}>
        {expanded.galeria && (
          <View style={styles.submenu}>
            <SubItem label="Astros" route="/(tabs)/galeria/astros/AstrosGallery" icon="🌟"  />
            <SubItem label="Planetas" route="/(tabs)/galeria/astros/PlanetsGallery" icon="🪐" />
            <SubItem label="Satélites" route="/(tabs)/galeria/astros/SatelitesGallery" icon="🛰️" />
            <SubItem label="Galaxias" route="/(tabs)/galeria/astros/GalaxiesGallery" icon="🌌" />
            <SubItem label="Exploraciones Espaciales" route="/(tabs)/galeria/exploracionesespaciales" icon="🚀" />
          </View>
        )}
      </Animated.View>

      <Section 
        title="📚 APRENDE CON NOSOTROS" 
        onPress={() => toggle("aprende")} 
        expanded={expanded.aprende}
      />
      <Animated.View style={[
        styles.submenuContainer,
        {
          maxHeight: animatedValues.aprende.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 80],
          }),
          opacity: animatedValues.aprende,
        }
      ]}>
        {expanded.aprende && (
          <View style={styles.submenu}>
            <SubItem
              label="Pregunta y respuesta (Juego)"
              route="/(tabs)/aprendeconnosotros/preguntayrespuesta"
              icon="🎯"
            />
          </View>
        )}
      </Animated.View>

      <Section 
        title="🎮 JUEGOS" 
        onPress={() => toggle("juego")} 
        expanded={expanded.juego}
      />
      <Animated.View style={[
        styles.submenuContainer,
        {
          maxHeight: animatedValues.juego.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 80],
          }),
          opacity: animatedValues.juego,
        }
      ]}>
        {expanded.juego && (
          <View style={styles.submenu}>
            <SubItem
              label="Asteroide Storm"
              route="/(tabs)/juegos/asteroid-storm"
              icon="☄️"
            />
          </View>
        )}
      </Animated.View>

      <Section 
        title="ℹ️ ACERCA DE" 
        onPress={() => toggle("acerca")} 
        expanded={expanded.acerca}
      />
      <Animated.View style={[
        styles.submenuContainer,
        {
          maxHeight: animatedValues.acerca.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 80],
          }),
          opacity: animatedValues.acerca,
        }
      ]}>
        {expanded.acerca && (
          <View style={styles.submenu}>
            <SubItem 
              label="Detalles de la app" 
              route="/(tabs)/acerca/acerca"
        
              icon="📱"
            />
          </View>
        )}
      </Animated.View>
    </DrawerContentScrollView>
  );
};

const Section = ({
  title,
  onPress,
  expanded,
}: {
  title: string;
  onPress: () => void;
  expanded: boolean;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.section}>
    <LinearGradient
      colors={expanded ? ['#667eea', '#764ba2'] : ['#2c3e50', '#34495e']}
      style={styles.sectionGradient}
    >
      <Text style={styles.sectionText}>{title}</Text>
      <Text style={[styles.arrow, { transform: [{ rotate: expanded ? '180deg' : '0deg' }] }]}>
        ▼
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

const SubItem = ({ 
  label, 
  route, 
  icon = "•" 
}: { 
  label: string; 
  route?: string; 
  icon?: string;
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.subItem}
      onPress={() => {
        if (route) router.push(route);
      }}
    >
      <View style={styles.subItemContent}>
        <Text style={styles.subItemIcon}>{icon}</Text>
        <Text style={styles.subItemText}>{label}</Text>
      </View>
      <View style={styles.subItemBorder} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#0a0a0a",
    minHeight: '100%',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  homeButton: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  homeButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
  },
  arrow: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  submenuContainer: {
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  submenu: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    backdropFilter: 'blur(10px)',
  },
  subItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  subItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subItemIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  subItemText: {
    color: "#e0e0e0",
    fontSize: 14,
    flex: 1,
  },
  subItemBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'transparent',
  },
});

export default CustomDrawer;