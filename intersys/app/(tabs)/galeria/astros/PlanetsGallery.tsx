import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    ScrollView,
    Dimensions,
    Alert,
    StatusBar,
    Platform,
    Animated,
    SafeAreaView,
    useWindowDimensions,
} from 'react-native';

interface Planet {
    id: string;
    name: string;
    englishName: string;
    isPlanet: boolean;
    mass: {
        massValue: number;
        massExponent: number;
    };
    vol: {
        volValue: number;
        volExponent: number;
    };
    density: number;
    gravity: number;
    escape: number;
    meanRadius: number;
    equaRadius: number;
    polarRadius: number;
    flattening: number;
    dimension: string;
    sideralOrbit: number;
    sideralRotation: number;
    aroundPlanet?: {
        planet: string;
        rel: string;
    };
    discoveredBy: string;
    discoveryDate: string;
    alternativeName: string;
    axialTilt: number;
    avgTemp: number;
    mainAnomaly: number;
    argPeriapsis: number;
    longAscNode: number;
    bodyType: string;
    rel: string;
    imageUrl?: string;
    description?: string;
    color?: string;
    interestingFacts?: string[];
}

const PlanetsGallery = () => {
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    
    // Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const modalAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(-100)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Datos enriquecidos de planetas con imágenes y descripciones
    const planetsData = {
        mercury: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
            color: '#8C7853',
            description: 'El planeta más cercano al Sol y el más pequeño del Sistema Solar. Su superficie está llena de cráteres similares a los de la Luna.',
            interestingFacts: [
                'Un día en Mercurio dura 176 días terrestres',
                'Las temperaturas varían entre -173°C y 427°C',
                'No tiene atmósfera significativa',
                'Tiene un núcleo de hierro muy grande'
            ]
        },
        venus: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_globe.jpg',
            color: '#FFC649',
            description: 'El planeta más caliente del Sistema Solar debido a su densa atmósfera de dióxido de carbono que crea un fuerte efecto invernadero.',
            interestingFacts: [
                'La temperatura superficial es de 462°C',
                'Rota en dirección opuesta a la mayoría de planetas',
                'Un día venusiano dura 243 días terrestres',
                'Su presión atmosférica es 90 veces mayor que la de la Tierra'
            ]
        },
        earth: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
            color: '#6B93D6',
            description: 'Nuestro hogar, el único planeta conocido que alberga vida. Tiene una atmósfera rica en oxígeno y vastos océanos de agua líquida.',
            interestingFacts: [
                'El 71% de su superficie está cubierta por agua',
                'Tiene una luna que influye en las mareas',
                'Su atmósfera nos protege de la radiación solar',
                'Es el único planeta donde se ha confirmado vida'
            ]
        },
        mars: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
            color: '#CD5C5C',
            description: 'El "Planeta Rojo" debe su color al óxido de hierro en su superficie. Es el objetivo principal para futuras misiones tripuladas.',
            interestingFacts: [
                'Tiene las montañas más altas del Sistema Solar',
                'Sus días duran 24 horas y 37 minutos',
                'Tiene dos pequeñas lunas: Fobos y Deimos',
                'Se han encontrado evidencias de agua líquida en el pasado'
            ]
        },
        jupiter: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
            color: '#D8CA9D',
            description: 'El gigante gaseoso más grande del Sistema Solar. Su Gran Mancha Roja es una tormenta que dura siglos.',
            interestingFacts: [
                'Es más grande que todos los demás planetas combinados',
                'Tiene más de 80 lunas conocidas',
                'Su Gran Mancha Roja es más grande que la Tierra',
                'Actúa como un "aspirador cósmico" protegiendo la Tierra'
            ]
        },
        saturn: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
            color: '#FAD5A5',
            description: 'Famoso por sus espectaculares anillos, está compuesto principalmente por hidrógeno y helio. Es menos denso que el agua.',
            interestingFacts: [
                'Flotaría en el agua si hubiera un océano lo suficientemente grande',
                'Sus anillos están hechos de hielo y roca',
                'Tiene más de 80 lunas, incluyendo Titán',
                'Sus anillos tienen solo 10 metros de espesor'
            ]
        },
        uranus: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
            color: '#4FD0E7',
            description: 'Un gigante de hielo que rota de lado. Su atmósfera contiene metano, lo que le da su color azul verdoso.',
            interestingFacts: [
                'Rota completamente de lado',
                'Sus anillos fueron descubiertos en 1977',
                'Tiene 27 lunas conocidas',
                'Un año en Urano dura 84 años terrestres'
            ]
        },
        neptune: {
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg',
            color: '#4B70DD',
            description: 'El planeta más lejano del Sistema Solar. Tiene los vientos más fuertes, alcanzando velocidades de hasta 2,100 km/h.',
            interestingFacts: [
                'Tiene los vientos más fuertes del Sistema Solar',
                'Su luna Tritón orbita en dirección retrógrada',
                'Fue descubierto mediante cálculos matemáticos',
                'Un año neptuniano dura 165 años terrestres'
            ]
        }
    };

    const getResponsiveLayout = () => {
        const padding = 20;
        const itemSpacing = 15;
        
        let numColumns = 1;
        
        if (isLandscape) {
            if (width >= 1200) {
                numColumns = 3;
            } else if (width >= 800) {
                numColumns = 2;
            } else {
                numColumns = 1;
            }
        } else {
            if (width >= 1000) {
                numColumns = 3;
            } else if (width >= 700) {
                numColumns = 2;
            } else {
                numColumns = 1;
            }
        }
        
        const availableWidth = width - (padding * 2) - (itemSpacing * (numColumns - 1));
        const itemWidth = availableWidth / numColumns;
        
        const imageHeight = isLandscape 
            ? Math.min(height * 0.4, 300)
            : width > 768 
                ? 220 
                : width > 480 
                    ? 200 
                    : 180;
        
        const titleSize = width > 768 ? 24 : width > 480 ? 20 : 18;
        const descriptionSize = width > 768 ? 16 : 14;
        const modalImageHeight = Math.min(height * 0.35, isLandscape ? 300 : 400);
        
        return { 
            numColumns, 
            itemWidth, 
            itemSpacing, 
            imageHeight,
            titleSize,
            descriptionSize,
            modalImageHeight
        };
    };

    const { 
        numColumns, 
        itemWidth, 
        itemSpacing, 
        imageHeight,
        titleSize,
        descriptionSize,
        modalImageHeight
    } = getResponsiveLayout();

    useEffect(() => {
        fetchPlanetsData();
        startAnimations();
    }, []);

    const startAnimations = () => {
        Animated.timing(headerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: true,
            })
        ).start();
    };

    const fetchPlanetsData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Iniciando fetch de planetas...');

            let response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true');

            if (!response.ok) {
                console.log('Primer intento falló, intentando con API key...');
                response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true', {
                    headers: {
                        'X-API-Key': 'OWWf9TW4A3sgM1t8Xs3VCWhQHv9udhavoR3Keugz'
                    }
                });
            }

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (!data.bodies || data.bodies.length === 0) {
                throw new Error('No se encontraron planetas en la respuesta');
            }

            const enrichedPlanets = data.bodies.map((planet: Planet) => {
                const planetKey = planet.englishName.toLowerCase() as keyof typeof planetsData;
                const enrichedData = planetsData[planetKey];

                return {
                    ...planet,
                    ...enrichedData,
                    imageUrl: enrichedData?.imageUrl || 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Planeta',
                    description: enrichedData?.description || 'Información no disponible',
                    color: enrichedData?.color || '#4A90E2',
                    interestingFacts: enrichedData?.interestingFacts || ['Información no disponible'],
                };
            });

            const order = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
            const orderedPlanets = enrichedPlanets.sort((a, b) => {
                const indexA = order.indexOf(a.englishName.toLowerCase());
                const indexB = order.indexOf(b.englishName.toLowerCase());
                return indexA - indexB;
            });

            console.log('Planetas procesados:', orderedPlanets.length);
            setPlanets(orderedPlanets);

        } catch (error) {
            console.error('Error fetching planets data:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');

            const fallbackPlanets = [
                {
                    id: 'mercury',
                    name: 'Mercurio',
                    englishName: 'Mercury',
                    isPlanet: true,
                    mass: { massValue: 3.301, massExponent: 23 },
                    vol: { volValue: 6.083, volExponent: 10 },
                    density: 5427,
                    gravity: 3.7,
                    escape: 4300,
                    meanRadius: 2439.7,
                    equaRadius: 2439.7,
                    polarRadius: 2439.7,
                    flattening: 0,
                    dimension: '',
                    sideralOrbit: 87.97,
                    sideralRotation: 1407.6,
                    discoveredBy: '',
                    discoveryDate: '',
                    alternativeName: '',
                    axialTilt: 0.034,
                    avgTemp: 440,
                    mainAnomaly: 0,
                    argPeriapsis: 0,
                    longAscNode: 0,
                    bodyType: 'Planet',
                    rel: '',
                    ...planetsData.mercury
                },
                {
                    id: 'venus',
                    name: 'Venus',
                    englishName: 'Venus',
                    isPlanet: true,
                    mass: { massValue: 4.867, massExponent: 24 },
                    vol: { volValue: 9.284, volExponent: 11 },
                    density: 5243,
                    gravity: 8.87,
                    escape: 10360,
                    meanRadius: 6051.8,
                    equaRadius: 6051.8,
                    polarRadius: 6051.8,
                    flattening: 0,
                    dimension: '',
                    sideralOrbit: 224.7,
                    sideralRotation: -5832.5,
                    discoveredBy: '',
                    discoveryDate: '',
                    alternativeName: '',
                    axialTilt: 177.36,
                    avgTemp: 737,
                    mainAnomaly: 0,
                    argPeriapsis: 0,
                    longAscNode: 0,
                    bodyType: 'Planet',
                    rel: '',
                    ...planetsData.venus
                },
                {
                    id: 'earth',
                    name: 'Tierra',
                    englishName: 'Earth',
                    isPlanet: true,
                    mass: { massValue: 5.972, massExponent: 24 },
                    vol: { volValue: 1.083, volExponent: 12 },
                    density: 5514,
                    gravity: 9.80665,
                    escape: 11180,
                    meanRadius: 6371.0,
                    equaRadius: 6378.1,
                    polarRadius: 6356.8,
                    flattening: 0.003353,
                    dimension: '',
                    sideralOrbit: 365.256,
                    sideralRotation: 23.93,
                    discoveredBy: '',
                    discoveryDate: '',
                    alternativeName: '',
                    axialTilt: 23.44,
                    avgTemp: 288,
                    mainAnomaly: 0,
                    argPeriapsis: 0,
                    longAscNode: 0,
                    bodyType: 'Planet',
                    rel: '',
                    ...planetsData.earth
                }
            ];

            setPlanets(fallbackPlanets);
            Alert.alert('🪐 Aviso', 'Usando datos de respaldo. Error: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPlanetsData();
    };

    const openModal = (planet: Planet) => {
        setSelectedPlanet(planet);
        setCurrentPlanetIndex(planets.findIndex(p => p.id === planet.id));
        setModalVisible(true);

        Animated.timing(modalAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setSelectedPlanet(null);
        });
    };

    const navigatePlanet = (direction: 'next' | 'prev') => {
        const newIndex = direction === 'next'
            ? (currentPlanetIndex + 1) % planets.length
            : (currentPlanetIndex - 1 + planets.length) % planets.length;

        setCurrentPlanetIndex(newIndex);
        setSelectedPlanet(planets[newIndex]);
    };

    const formatNumber = (value: number, exponent?: number) => {
        if (exponent !== undefined) {
            return `${value} × 10^${exponent}`;
        }
        return value.toLocaleString();
    };

    const renderPlanetItem = ({ item }: { item: Planet }) => {
        const spin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        return (
            <Animated.View
                style={[
                    styles.planetItem,
                    {
                        width: itemWidth,
                        opacity: fadeAnim,
                        transform: [{
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [100, 0]
                            })
                        }],
                        marginBottom: itemSpacing,
                        marginRight: numColumns > 1 ? itemSpacing : 0
                    }
                ]}
            >
                <TouchableOpacity
                    onPress={() => openModal(item)}
                    activeOpacity={0.9}
                    style={styles.touchableItem}
                >
                    <View style={[styles.planetImageContainer, { 
                        borderColor: item.color,
                        height: imageHeight 
                    }]}>
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.planetImage}
                                resizeMode="cover"
                                onError={(e) => {
                                                                        console.log('Error loading image:', e.nativeEvent.error);
                                }}
                            />
                        </Animated.View>
                        <View style={[styles.planetOverlay, { backgroundColor: `${item.color}20` }]}>
                            <Text style={[styles.planetName, { fontSize: titleSize }]}>{item.englishName}</Text>
                            <Text style={styles.planetType}>🪐 PLANETA</Text>
                        </View>
                    </View>

                    <View style={styles.planetInfo}>
                        <Text style={[styles.planetTitle, { fontSize: titleSize }]}>{item.englishName}</Text>
                        <Text style={[styles.planetDescription, { fontSize: descriptionSize }]} numberOfLines={3}>
                            {item.description}
                        </Text>

                        <View style={styles.planetStats}>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Radio</Text>
                                <Text style={styles.statValue}>{formatNumber(item.meanRadius)} km</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Gravedad</Text>
                                <Text style={styles.statValue}>{item.gravity.toFixed(1)} m/s²</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <View style={styles.loadingContent}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <Text style={styles.loadingIcon}>🌌</Text>
                    </Animated.View>
                    <ActivityIndicator size="large" color="#4A90E2" style={styles.loadingSpinner} />
                    <Text style={styles.loadingText}>Explorando planetas...</Text>
                    <Text style={styles.loadingSubtext}>Cargando datos del Sistema Solar</Text>
                    {error && (
                        <Text style={styles.errorText}>Error: {error}</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <Animated.View
                style={[
                    styles.headerContainer,
                    { transform: [{ translateY: headerAnim }] }
                ]}
            >
                <View style={styles.headerContent}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <Text style={styles.headerIcon}>🪐</Text>
                    </Animated.View>
                    <Text style={styles.headerTitle}>PLANETAS DEL SISTEMA SOLAR</Text>
                    <Text style={styles.headerSubtitle}>Descubre los mundos de nuestro sistema</Text>
                    <View style={styles.headerDivider} />
                </View>
            </Animated.View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                    <Text style={styles.errorSubtext}>Mostrando datos de respaldo</Text>
                </View>
            )}

            <FlatList
                data={planets}
                renderItem={renderPlanetItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                key={`${numColumns}-${width}`}
                contentContainerStyle={styles.galleryContainer}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ItemSeparatorComponent={() => <View style={{ height: itemSpacing }} />}
                columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="none"
                onRequestClose={closeModal}
                statusBarTranslucent
            >
                <Animated.View
                    style={[
                        styles.modalBackground,
                        {
                            opacity: modalAnim,
                            transform: [{
                                scale: modalAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.9, 1]
                                })
                            }]
                        }
                    ]}
                >
                    <SafeAreaView style={styles.modalSafeArea}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity style={styles.navButton} onPress={() => navigatePlanet('prev')}>
                                <Text style={styles.navButtonText}>‹</Text>
                            </TouchableOpacity>

                            <View style={styles.modalCounter}>
                                <Text style={styles.counterText}>
                                    {currentPlanetIndex + 1} de {planets.length}
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.navButton} onPress={() => navigatePlanet('next')}>
                                <Text style={styles.navButtonText}>›</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>

                        <ScrollView
                            contentContainerStyle={styles.modalContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            {selectedPlanet && (
                                <>
                                    <View style={[styles.modalImageContainer, { height: modalImageHeight }]}>
                                        <Animated.View style={{ transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
                                            <Image
                                                source={{ uri: selectedPlanet.imageUrl }}
                                                style={styles.modalImage}
                                                resizeMode="cover"
                                            />
                                        </Animated.View>
                                        <View style={[styles.modalImageOverlay, { backgroundColor: `${selectedPlanet.color}90` }]}>
                                            <Text style={styles.modalTitle}>
                                                {selectedPlanet.englishName}
                                            </Text>
                                            <Text style={styles.modalImageSubtitle}>
                                                {selectedPlanet.bodyType}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.modalInfo}>
                                        <Text style={styles.modalTitle}>
                                            {selectedPlanet.englishName}
                                        </Text>

                                        <Text style={styles.modalDescription}>
                                            {selectedPlanet.description}
                                        </Text>

                                        <View style={styles.factsContainer}>
                                            <Text style={styles.factsTitle}>🔬 Datos Curiosos</Text>
                                            {selectedPlanet.interestingFacts?.map((fact, index) => (
                                                <Text key={index} style={styles.factItem}>
                                                    • {fact}
                                                </Text>
                                            ))}
                                        </View>

                                        <View style={styles.detailsContainer}>
                                            <Text style={styles.detailsTitle}>📊 Características Físicas</Text>

                                            <View style={styles.detailsGrid}>
                                                <View style={styles.detailItem}>
                                                    <Text style={styles.detailLabel}>Radio Medio</Text>
                                                    <Text style={styles.detailValue}>{formatNumber(selectedPlanet.meanRadius)} km</Text>
                                                </View>
                                                <View style={styles.detailItem}>
                                                    <Text style={styles.detailLabel}>Gravedad</Text>
                                                    <Text style={styles.detailValue}>{selectedPlanet.gravity.toFixed(1)} m/s²</Text>
                                                </View>
                                                <View style={styles.detailItem}>
                                                    <Text style={styles.detailLabel}>Densidad</Text>
                                                    <Text style={styles.detailValue}>{selectedPlanet.density.toFixed(1)} g/cm³</Text>
                                                </View>
                                                <View style={styles.detailItem}>
                                                    <Text style={styles.detailLabel}>Período Orbital</Text>
                                                    <Text style={styles.detailValue}>{selectedPlanet.sideralOrbit.toFixed(1)} días</Text>
                                                </View>
                                                <View style={styles.detailItem}>
                                                    <Text style={styles.detailLabel}>Masa</Text>
                                                    <Text style={styles.detailValue}>{formatNumber(selectedPlanet.mass.massValue, selectedPlanet.mass.massExponent)} kg</Text>
                                                </View>
                                                <View style={styles.detailItem}>
                                                    <Text style={styles.detailLabel}>Temperatura</Text>
                                                    <Text style={styles.detailValue}>{selectedPlanet.avgTemp ? selectedPlanet.avgTemp.toFixed(1) : 'N/A'} K</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </SafeAreaView>
                </Animated.View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerContainer: {
        backgroundColor: '#000',
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: Platform.select({
            ios: 24,
            android: 22,
            default: 26
        }),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: '#4A90E2',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        letterSpacing: 1,
        maxWidth: '90%',
    },
    headerSubtitle: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 15,
    },
    headerDivider: {
        width: 100,
        height: 3,
        backgroundColor: '#4A90E2',
        borderRadius: 2,
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    errorContainer: {
        backgroundColor: '#ff4444',
        padding: 10,
        margin: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorSubtext: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
    galleryContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    planetItem: {
        backgroundColor: '#111',
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#222',
    },
    touchableItem: {
        flex: 1,
    },
    planetImageContainer: {
        position: 'relative',
        borderTopWidth: 3,
    },
    planetImage: {
        width: '100%',
        height: '100%',
    },
    planetOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        justifyContent: 'flex-end',
    },
    planetName: {
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        marginBottom: 5,
    },
    planetType: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.9,
    },
    planetInfo: {
        padding: 20,
    },
    planetTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    planetDescription: {
        color: '#aaa',
        lineHeight: 20,
        marginBottom: 15,
        textAlign: 'justify',
    },
    planetStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        marginBottom: 5,
    },
    statValue: {
        color: '#4A90E2',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loadingContent: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    loadingSpinner: {
        marginVertical: 20,
    },
    loadingText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    loadingSubtext: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    modalSafeArea: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    navButton: {
        backgroundColor: 'rgba(74, 144, 226, 0.3)',
        width: Platform.select({
            default: 50,
            web: 60
        }),
        height: Platform.select({
            default: 50,
            web: 60
        }),
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4A90E2',
    },
    navButtonText: {
        color: '#4A90E2',
        fontSize: 30,
        fontWeight: 'bold',
    },
    modalCounter: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    counterText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        top: Platform.select({
            ios: 30,
            android: 20,
            default: 30
        }),
        right: Platform.select({
            ios: 30,
            android: 20,
            default: 30
        }),
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: Platform.select({
            default: 50,
            web: 60
        }),
        height: Platform.select({
            default: 50,
            web: 60
        }),
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    modalContainer: {
        flexGrow: 1,
        paddingHorizontal: Platform.select({
            default: 20,
            web: Math.min(40, Dimensions.get('window').width * 0.1)
        }),
        paddingBottom: 40,
    },
    modalImageContainer: {
        position: 'relative',
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#111',
        marginBottom: 25,
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalImageSubtitle: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.9,
        fontWeight: '600',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        marginTop: 5,
    },
    modalImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 25,
        alignItems: 'center',
    },
    modalInfo: {
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        borderRadius: 25,
        padding: 25,
        borderWidth: 1,
        borderColor: '#222',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        textShadowColor: '#4A90E2',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    modalDescription: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 25,
        textAlign: 'justify',
    },
    factsContainer: {
        marginBottom: 25,
    },
    factsTitle: {
        color: '#4A90E2',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    factItem: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 8,
        paddingLeft: 10,
    },
    detailsContainer: {
        marginTop: 10,
    },
    detailsTitle: {
        color: '#4A90E2',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailItem: {
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        width: '48%',
        borderWidth: 1,
        borderColor: 'rgba(74, 144, 226, 0.3)',
    },
    detailLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 8,
        fontWeight: '600',
    },
    detailValue: {
        color: '#4A90E2',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PlanetsGallery;

