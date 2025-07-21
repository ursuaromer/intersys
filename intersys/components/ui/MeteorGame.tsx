
import React, { useState, useEffect, useRef } from 'react'; 
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Text,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import { ViewProps } from 'react-native';
import { Platform } from 'react-native';

import { useRouter } from 'expo-router';
import { Easing } from 'react-native';
import { Audio } from 'expo-av';

import Lives from '@/components/ui/Lives';
import Score from '@/components/ui/Score';

import Meteor from './Meteor';
import AnimatedSpaceship, { AnimatedSpaceshipHandle } from './AnimatedSpaceship';

const musicaFondo = require('@/assets/audios/audiojuego.mp3');
const ambienteEspacial = require('@/assets/audios/sonidonave.mp3');


import meteor1 from '@/assets/images/meteorito1.png';
import meteor2 from '@/assets/images/meteorito2.png';
import meteor3 from '@/assets/images/meteorito3.png';
import fondoEstrellas from '@/assets/images/galaxia5.png';

const { width, height } = Dimensions.get('window');
const meteorImages = [meteor1, meteor2, meteor3];
const SHIP_WIDTH = 30;
const SHIP_HEIGHT = 25;
const SHIP_RADIUS = 15; // Ajustado para mejorar colisión
const METEOR_RADIUS = 20; // Ajustado para mejorar colisión
const MAX_METEORS = 25;

const MemoizedMeteor = React.memo(Meteor);

type MeteorData = {
  id: number;
  x: number;
  y: number;
  speed: number;
  image: any;
};

export default function MeteorGame() {
  const router = useRouter();
  const [shipPosition, setShipPosition] = useState({
    x: width / 2 - SHIP_WIDTH / 2,
    y: height - 100,
  });
  const shipPositionRef = useRef(shipPosition);
  const [meteorBaseSpeed, setMeteorBaseSpeed] = useState(2);
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const meteorsRef = useRef<MeteorData[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  const meteorId = useRef(0);
  const [sound1, setSound1] = useState<Audio.Sound | null>(null);
  const [sound2, setSound2] = useState<Audio.Sound | null>(null);

  const spaceshipRef = useRef<AnimatedSpaceshipHandle>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const backgroundAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startBackgroundAnimation = () => {
    scrollY.setValue(0);
    backgroundAnimationRef.current = Animated.loop(
      Animated.timing(scrollY, {
        toValue: height,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    backgroundAnimationRef.current.start();
  };

  const stopBackgroundAnimation = () => {
    backgroundAnimationRef.current?.stop();
  };

  useEffect(() => {
    startBackgroundAnimation();
    return () => stopBackgroundAnimation();
  }, []);

  useEffect(() => {
    meteorsRef.current = meteors;
  }, [meteors]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const resetGame = () => {
    setShipPosition({
      x: width / 2 - SHIP_WIDTH / 2,
      y: height - 100,
    });
    shipPositionRef.current = {
      x: width / 2 - SHIP_WIDTH / 2,
      y: height - 100,
    };
    setMeteors([]);
    meteorsRef.current = [];
    setMeteorBaseSpeed(2);
    setLives(3);
    meteorId.current = 0;
    setScore(0);
    setGameOver(false);
    setPaused(false);
    startBackgroundAnimation();
    sound1?.playAsync();
    sound2?.playAsync();
  };

  const togglePause = async () => {
    setPaused((prev) => {
      const next = !prev;
      if (next) {
        stopBackgroundAnimation();
        sound1?.pauseAsync();
        sound2?.pauseAsync();
      } else {
        startBackgroundAnimation();
        sound1?.playAsync();
        sound2?.playAsync();
      }
      return next;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (pausedRef.current || gameOver) return;
        const OFFSET_X = 30; // mover más a la izquierda
        const OFFSET_Y = 80; // mover más arriba

        const newX = gestureState.moveX - SHIP_WIDTH / 2 - OFFSET_X;
        const newY = gestureState.moveY - SHIP_HEIGHT / 2 - OFFSET_Y;

        setShipPosition({ x: newX, y: newY });
        shipPositionRef.current = { x: newX, y: newY };
      },
    })
  ).current;

  useEffect(() => {
    if (gameOver || paused) return;
    const spawnInterval = setInterval(() => {
      const newMeteor: MeteorData = {
        id: meteorId.current++,
        x: Math.random() * (width - 30),
        y: 0,
        speed: meteorBaseSpeed + Math.random() * 2,
        image: meteorImages[Math.floor(Math.random() * meteorImages.length)],
      };
      setMeteors((prev) => {
        const newList = [...prev, newMeteor];
        return newList.length > MAX_METEORS ? newList.slice(-MAX_METEORS) : newList;
      });
    }, 300);
    return () => clearInterval(spawnInterval);
  }, [meteorBaseSpeed, gameOver, paused]);

  useEffect(() => {
    if (gameOver || paused) return;
    const speedInterval = setInterval(() => {
      setMeteorBaseSpeed((prev) => prev + 0.3);
    }, 500);
    return () => clearInterval(speedInterval);
  }, [gameOver, paused]);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = Date.now();
    const update = () => {
      const now = Date.now();
      const delta = now - lastUpdate;
      lastUpdate = now;
      if (!paused && !gameOver) {
        let collided = false;
        setMeteors((prevMeteors) => {
          const updated = prevMeteors
            .map((m) => {
              const newY = m.y + m.speed * (delta / 16.67);

              const meteorCenterX = m.x + METEOR_RADIUS;
              const meteorCenterY = newY + METEOR_RADIUS;
              const shipCenterX = shipPositionRef.current.x + SHIP_WIDTH / 2;
              const shipCenterY = shipPositionRef.current.y + SHIP_HEIGHT / 2;

              const dx = meteorCenterX - shipCenterX;
              const dy = meteorCenterY - shipCenterY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              const isCollision = distance < METEOR_RADIUS + SHIP_RADIUS;

              if (isCollision && !collided) {
                collided = true;
                spaceshipRef.current?.shake();
                return null;
              }
              return { ...m, y: newY };
            })
            .filter((m): m is MeteorData => m !== null && m.y < height + 40);

          if (collided) {
            setLives((prev) => {
              const newLives = Math.max(prev - 1, 0);
              if (newLives === 0) setGameOver(true);
              return newLives;
            });
          }
          if (!collided) {
              setScore((prev) => prev + 1);
          }

          return updated;
        });
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [paused, gameOver]);

  useEffect(() => {
    let s1: Audio.Sound | null = null;
    let s2: Audio.Sound | null = null;
    let isMounted = true;

    const loadAndPlay = async () => {
      try {
        const { sound: soundObj1 } = await Audio.Sound.createAsync(musicaFondo, {
          isLooping: true,
          volume: 0.5,
        });
        const { sound: soundObj2 } = await Audio.Sound.createAsync(ambienteEspacial, {
          isLooping: true,
          volume: 0.3,
        });

        if (!isMounted) {
          await soundObj1.unloadAsync();
          await soundObj2.unloadAsync();
          return;
        }

        s1 = soundObj1;
        s2 = soundObj2;
        setSound1(soundObj1);
        setSound2(soundObj2);

        await s1.playAsync();
        await s2.playAsync();
      } catch (error) {
        console.error('Error al cargar sonidos:', error);
      }
    };

    loadAndPlay();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        try {
          if (s1) {
            const status1 = await s1.getStatusAsync();
            if (status1.isLoaded) {
              await s1.stopAsync();
              await s1.unloadAsync();
            }
          }
          if (s2) {
            const status2 = await s2.getStatusAsync();
            if (status2.isLoaded) {
              await s2.stopAsync();
              await s2.unloadAsync();
            }
          }
        } catch (e) {
          console.warn('Error descargando sonidos:', e);
        }
      };
      cleanup();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        {...({ pointerEvents: 'none' } as any)}
        source={fondoEstrellas}
        style={[styles.backgroundImage, { transform: [{ translateY: scrollY }] }]}
        resizeMode="cover"
      />
      <Animated.Image
        {...({ pointerEvents: 'none' } as any)}
        source={fondoEstrellas}
        style={[styles.backgroundImage, { top: -height, transform: [{ translateY: scrollY }] }]}
        resizeMode="cover"
      />

      <Lives lives={lives} />
      <Score score={score} />

      <View style={styles.pauseButtonContainer} pointerEvents="auto">
        <Pressable style={styles.pauseButton} onPress={togglePause}>
          <Text style={styles.buttonText}>{paused ? '▶️ Reanudar' : '⏸ Pausar'}</Text>
        </Pressable>

        <Pressable
          style={styles.menuButton}
          onPress={async () => {
            await sound1?.unloadAsync();
            await sound2?.unloadAsync();
            router.replace('/');
          }}>
          <Text style={styles.buttonText}>🏠 Menú</Text>
        </Pressable>
      </View>

      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} pointerEvents="box-none">
        {meteors.map((m) => (
          <MemoizedMeteor key={m.id} x={m.x} y={m.y} source={m.image} />
        ))}
        <AnimatedSpaceship ref={spaceshipRef} x={shipPosition.x} y={shipPosition.y} />
      </View>

      {gameOver && (
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="auto">
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Pressable style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>🔁 Reiniciar</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={async () => {
              await sound1?.unloadAsync();
              await sound2?.unloadAsync();
              router.replace('/');
            }}>
            <Text style={styles.buttonText}>🏠 Ir al Menú</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: height,
  },
  pauseButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    gap: 12, // esto crea separación entre los botones
    alignItems: 'flex-end',
  },

  pauseButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },

  menuButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  gameOverText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#2e2e2e',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#555',
  },

  

});
