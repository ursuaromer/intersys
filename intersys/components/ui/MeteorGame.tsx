





// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   PanResponder,
//   Text,
//   Pressable,
//   Animated,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import Meteor from './Meteor';
// import Spaceship from './Spaceship';
// import { Easing } from 'react-native';
// import { Audio } from 'expo-av';

// import musicaFondo from '@/assets/audios/audiojuego.mp3';
// import ambienteEspacial from '@/assets/audios/sonidonave.mp3';

// import meteor1 from '@/assets/images/meteorito1.png';
// import meteor2 from '@/assets/images/meteorito2.png';
// import meteor3 from '@/assets/images/meteorito3.png';
// import fondoEstrellas from '@/assets/images/galaxia5.png';

// const { width, height } = Dimensions.get('window');
// const meteorImages = [meteor1, meteor2, meteor3];
// const SHIP_WIDTH = 50;
// const SHIP_HEIGHT = 50;

// type MeteorData = {
//   id: number;
//   x: number;
//   y: number;
//   speed: number;
//   image: any;
// };

// export default function MeteorGame() {
//   const router = useRouter();
//   const [shipX, setShipX] = useState(width / 2 - SHIP_WIDTH / 2);
//   const [sound1, setSound1] = useState<Audio.Sound | null>(null);
//   const [sound2, setSound2] = useState<Audio.Sound | null>(null);
//   const shipXRef = useRef(shipX);
//   const [meteorBaseSpeed, setMeteorBaseSpeed] = useState(2);
//   const [meteors, setMeteors] = useState<MeteorData[]>([]);
//   const meteorsRef = useRef<MeteorData[]>([]);
//   const [lives, setLives] = useState(3);
//   const [gameOver, setGameOver] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const pausedRef = useRef(paused);
//   const meteorId = useRef(0);

//   const scrollY = useRef(new Animated.Value(0)).current;
//   const backgroundAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

//   const startBackgroundAnimation = () => {
//     scrollY.setValue(0);
//     backgroundAnimationRef.current = Animated.loop(
//       Animated.timing(scrollY, {
//         toValue: height,
//         duration: 8000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     );
//     backgroundAnimationRef.current.start();
//   };

//   const stopBackgroundAnimation = () => {
//     backgroundAnimationRef.current?.stop();
//   };

//   useEffect(() => {
//     startBackgroundAnimation();
//     return () => stopBackgroundAnimation();
//   }, []);

//   useEffect(() => {
//     meteorsRef.current = meteors;
//   }, [meteors]);

//   useEffect(() => {
//     pausedRef.current = paused;
//   }, [paused]);

//   const resetGame = () => {
//     setShipX(width / 2 - SHIP_WIDTH / 2);
//     shipXRef.current = width / 2 - SHIP_WIDTH / 2;
//     setMeteors([]);
//     setMeteorBaseSpeed(2);
//     setLives(3);
//     meteorId.current = 0;
//     setGameOver(false);
//     setPaused(false);
//     startBackgroundAnimation();
//     sound1?.playAsync();
//     sound2?.playAsync();
//   };

//   const togglePause = async () => {
//     setPaused((prev) => {
//       const next = !prev;
//       if (next) {
//         stopBackgroundAnimation();
//         sound1?.pauseAsync();
//         sound2?.pauseAsync();
//       } else {
//         startBackgroundAnimation();
//         sound1?.playAsync();
//         sound2?.playAsync();
//       }
//       return next;
//     });
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, gestureState) => {
//         if (pausedRef.current || gameOver) return;
//         const newX = gestureState.moveX - SHIP_WIDTH / 2;
//         setShipX(newX);
//         shipXRef.current = newX;
//       },
//     })
//   ).current;

//   useEffect(() => {
//     if (gameOver || paused) return;
//     const spawnInterval = setInterval(() => {
//       const newMeteor: MeteorData = {
//         id: meteorId.current++,
//         x: Math.random() * (width - 30),
//         y: 0,
//         speed: meteorBaseSpeed + Math.random() * 2,
//         image: meteorImages[Math.floor(Math.random() * meteorImages.length)],
//       };
//       setMeteors((prev) => [...prev, newMeteor]);
//     }, 500);
//     return () => clearInterval(spawnInterval);
//   }, [meteorBaseSpeed, gameOver, paused]);

//   useEffect(() => {
//     if (gameOver || paused) return;
//     const speedInterval = setInterval(() => {
//       setMeteorBaseSpeed((prev) => prev + 0.3);
//     }, 1000);
//     return () => clearInterval(speedInterval);
//   }, [gameOver, paused]);

//   useEffect(() => {
//     let animationFrameId: number;
//     let lastUpdate = Date.now();
//     const update = () => {
//       const now = Date.now();
//       const delta = now - lastUpdate;
//       lastUpdate = now;
//       if (!paused && !gameOver) {
//         let collided = false;
//         setMeteors((prevMeteors) => {
//           const updated = prevMeteors
//             .map((m) => {
//               const newY = m.y + m.speed * (delta / 16.67);
//               const shipTop = height - 100;
//               const meteorSize = 30;
//               const isCollision =
//                 newY + meteorSize >= shipTop &&
//                 newY <= shipTop + SHIP_HEIGHT &&
//                 m.x < shipXRef.current + SHIP_WIDTH / 2 &&
//                 m.x + meteorSize > shipXRef.current - SHIP_WIDTH / 2;
//               if (isCollision && !collided) {
//                 collided = true;
//                 return null;
//               }
//               return { ...m, y: newY };
//             })
//             .filter((m): m is MeteorData => m !== null && m.y < height + 40);
//           if (collided) {
//             setLives((prev) => {
//               const newLives = Math.max(prev - 1, 0);
//               if (newLives === 0) setGameOver(true);
//               return newLives;
//             });
//           }
//           return updated;
//         });
//       }
//       animationFrameId = requestAnimationFrame(update);
//     };
//     animationFrameId = requestAnimationFrame(update);
//     return () => cancelAnimationFrame(animationFrameId);
//   }, [paused, gameOver]);

//   useEffect(() => {
//     let s1: Audio.Sound;
//     let s2: Audio.Sound;

//     const loadAndPlay = async () => {
//       const { sound: soundObj1 } = await Audio.Sound.createAsync(musicaFondo, {
//         isLooping: true,
//         volume: 0.5,
//         shouldPlay: true,
//       });
//       const { sound: soundObj2 } = await Audio.Sound.createAsync(ambienteEspacial, {
//         isLooping: true,
//         volume: 0.3,
//         shouldPlay: true,
//       });
//       setSound1(soundObj1);
//       setSound2(soundObj2);
//       s1 = soundObj1;
//       s2 = soundObj2;
//       await soundObj1.playAsync();
//       await soundObj2.playAsync();
//     };

//     loadAndPlay();

//     return () => {
//       if (s1) s1.unloadAsync();
//       if (s2) s2.unloadAsync();
//     };
//   }, []);

//   return (
//     <View style={styles.container} {...panResponder.panHandlers}>
//       <Animated.Image
//         pointerEvents="none"
//         source={fondoEstrellas}
//         style={[styles.backgroundImage, { transform: [{ translateY: scrollY }] }]}
//         resizeMode="cover"
//       />

//       <Animated.Image
//         pointerEvents="none"
//         source={fondoEstrellas}
//         style={[styles.backgroundImage, { top: -height, transform: [{ translateY: scrollY }] }]}
//         resizeMode="cover"
//       />

//       <View style={styles.livesContainer}>
//         {Array.from({ length: lives }).map((_, index) => (
//           <View key={index} style={styles.life} />
//         ))}
//       </View>

//       <View style={styles.pauseButtonContainer}>
//         <Pressable style={styles.pauseButton} onPress={togglePause}>
//           <Text style={styles.buttonText}>{paused ? '▶️ Reanudar' : '⏸ Pausar'}</Text>
//         </Pressable>
//       </View>

//       {meteors.map((m) => (
//         <Meteor key={m.id} x={m.x} y={m.y} source={m.image} />
//       ))}

//       <Spaceship x={shipX} />

//       {gameOver && (
//         <View style={[StyleSheet.absoluteFill, styles.center]}>
//           <Text style={styles.gameOverText}>GAME OVER</Text>
//           <Pressable style={styles.button} onPress={resetGame}>
//             <Text style={styles.buttonText}>🔁 Reiniciar</Text>
//           </Pressable>
//           <Pressable
//             style={styles.button}
//             onPress={async () => {
//               await sound1?.unloadAsync();
//               await sound2?.unloadAsync();
//               router.replace('/entretenimiento');
//             }}
//           >
//             <Text style={styles.buttonText}>🏠 Ir al Inicio</Text>
//           </Pressable>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     overflow: 'hidden',
//   },
//   backgroundImage: {
//     position: 'absolute',
//     width: '100%',
//     height: height,
//   },
//   livesContainer: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     flexDirection: 'row',
//     gap: 10,
//     zIndex: 10,
//   },
//   life: {
//     width: 20,
//     height: 20,
//     backgroundColor: 'red',
//     borderRadius: 10,
//   },
//   pauseButtonContainer: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     zIndex: 10,
//   },
//   pauseButton: {
//     backgroundColor: '#666',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   gameOverText: {
//     color: 'white',
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#444',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });




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
import { useRouter } from 'expo-router';
import { Easing } from 'react-native';
import { Audio } from 'expo-av';

import Meteor from './Meteor';
import Spaceship from './Spaceship';

import musicaFondo from '@/assets/audios/audiojuego.mp3';
import ambienteEspacial from '@/assets/audios/sonidonave.mp3';

import meteor1 from '@/assets/images/meteorito1.png';
import meteor2 from '@/assets/images/meteorito2.png';
import meteor3 from '@/assets/images/meteorito3.png';
import fondoEstrellas from '@/assets/images/galaxia5.png';

const { width, height } = Dimensions.get('window');
const meteorImages = [meteor1, meteor2, meteor3];
const SHIP_WIDTH = 50;
const SHIP_HEIGHT = 50;
const MAX_METEORS = 25;

const MemoizedMeteor = React.memo(Meteor);
const MemoizedSpaceship = React.memo(Spaceship);

type MeteorData = {
  id: number;
  x: number;
  y: number;
  speed: number;
  image: any;
};

export default function MeteorGame() {
  const router = useRouter();
  const [shipX, setShipX] = useState(width / 2 - SHIP_WIDTH / 2);
  const shipXRef = useRef(shipX);
  const [meteorBaseSpeed, setMeteorBaseSpeed] = useState(2);
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const meteorsRef = useRef<MeteorData[]>([]);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  const meteorId = useRef(0);
  const [sound1, setSound1] = useState<Audio.Sound | null>(null);
  const [sound2, setSound2] = useState<Audio.Sound | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const backgroundAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startBackgroundAnimation = () => {
    scrollY.setValue(0);
    backgroundAnimationRef.current = Animated.loop(
      Animated.timing(scrollY, {
        toValue: height,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
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
    setShipX(width / 2 - SHIP_WIDTH / 2);
    shipXRef.current = width / 2 - SHIP_WIDTH / 2;
    setMeteors([]);
    meteorsRef.current = [];
    setMeteorBaseSpeed(2);
    setLives(3);
    meteorId.current = 0;
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
        const newX = gestureState.moveX - SHIP_WIDTH / 2;
        setShipX(newX);
        shipXRef.current = newX;
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
    }, 700);
    return () => clearInterval(spawnInterval);
  }, [meteorBaseSpeed, gameOver, paused]);

  useEffect(() => {
    if (gameOver || paused) return;
    const speedInterval = setInterval(() => {
      setMeteorBaseSpeed((prev) => prev + 0.3);
    }, 1000);
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
              const shipTop = height - 100;
              const meteorSize = 30;
              const isCollision =
                newY + meteorSize >= shipTop &&
                newY <= shipTop + SHIP_HEIGHT &&
                m.x < shipXRef.current + SHIP_WIDTH / 2 &&
                m.x + meteorSize > shipXRef.current - SHIP_WIDTH / 2;
              if (isCollision && !collided) {
                collided = true;
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
          return updated;
        });
      }
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [paused, gameOver]);

  // useEffect(() => {
  //   let s1: Audio.Sound;
  //   let s2: Audio.Sound;
  //   const loadAndPlay = async () => {
  //     const { sound: soundObj1 } = await Audio.Sound.createAsync(musicaFondo, {
  //       isLooping: true,
  //       volume: 0.5,
  //       shouldPlay: true,
  //     });
  //     const { sound: soundObj2 } = await Audio.Sound.createAsync(ambienteEspacial, {
  //       isLooping: true,
  //       volume: 0.3,
  //       shouldPlay: true,
  //     });
  //     setSound1(soundObj1);
  //     setSound2(soundObj2);
  //     s1 = soundObj1;
  //     s2 = soundObj2;
  //   };
  //   loadAndPlay();
  //   return () => {
  //     if (s1) s1.unloadAsync();
  //     if (s2) s2.unloadAsync();
  //   };
  // }, []);
  // useEffect(() => {
  //   let s1: Audio.Sound;
  //   let s2: Audio.Sound;

  //   const loadAndPlay = async () => {
  //     const { sound: soundObj1 } = await Audio.Sound.createAsync(musicaFondo, {
  //       isLooping: true,
  //       volume: 0.5,
  //       shouldPlay: true,
  //     });
  //     const { sound: soundObj2 } = await Audio.Sound.createAsync(ambienteEspacial, {
  //       isLooping: true,
  //       volume: 0.3,
  //       shouldPlay: true,
  //     });
  //     setSound1(soundObj1);
  //     setSound2(soundObj2);
  //     s1 = soundObj1;
  //     s2 = soundObj2;
  //     await s1.playAsync();
  //     await s2.playAsync();
  //   };

  //   loadAndPlay();

  //   return () => {
  //     const stopAndUnload = async () => {
  //       if (s1) {
  //         await s1.stopAsync();
  //         await s1.unloadAsync();
  //       }
  //       if (s2) {
  //         await s2.stopAsync();
  //         await s2.unloadAsync();
  //       }
  //     };
  //     stopAndUnload();
  //   };
  // }, []);
  // useEffect(() => {
  //   let s1: Audio.Sound | null = null;
  //   let s2: Audio.Sound | null = null;

  //   const loadAndPlay = async () => {
  //     const { sound: soundObj1 } = await Audio.Sound.createAsync(musicaFondo, {
  //       isLooping: true,
  //       volume: 0.5,
  //       shouldPlay: true,
  //     });
  //     const { sound: soundObj2 } = await Audio.Sound.createAsync(ambienteEspacial, {
  //       isLooping: true,
  //       volume: 0.3,
  //       shouldPlay: true,
  //     });
  //     setSound1(soundObj1);
  //     setSound2(soundObj2);
  //     s1 = soundObj1;
  //     s2 = soundObj2;
  //     await s1.playAsync();
  //     await s2.playAsync();
  //   };

  //   loadAndPlay();

  //   return () => {
  //     const stopAndUnload = async () => {
  //       if (s1) {
  //         const status1 = await s1.getStatusAsync();
  //         if (status1.isLoaded) {
  //           await s1.stopAsync();
  //           await s1.unloadAsync();
  //         }
  //       }
  //       if (s2) {
  //         const status2 = await s2.getStatusAsync();
  //         if (status2.isLoaded) {
  //           await s2.stopAsync();
  //           await s2.unloadAsync();
  //         }
  //       }
  //     };
  //     stopAndUnload();
  //   };
  // }, []);

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
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.Image
        pointerEvents="none"
        source={fondoEstrellas}
        style={[styles.backgroundImage, { transform: [{ translateY: scrollY }] }]}
        resizeMode="cover"
      />
      <Animated.Image
        pointerEvents="none"
        source={fondoEstrellas}
        style={[styles.backgroundImage, { top: -height, transform: [{ translateY: scrollY }] }]}
        resizeMode="cover"
      />
      <View style={styles.livesContainer}>
        {Array.from({ length: lives }).map((_, index) => (
          <View key={index} style={styles.life} />
        ))}
      </View>
      <View style={styles.pauseButtonContainer}>
        <Pressable style={styles.pauseButton} onPress={togglePause}>
          <Text style={styles.buttonText}>{paused ? '▶️ Reanudar' : '⏸ Pausar'}</Text>
        </Pressable>
      </View>
      {meteors.map((m) => (
        <MemoizedMeteor key={m.id} x={m.x} y={m.y} source={m.image} />
      ))}
      <MemoizedSpaceship x={shipX} />
      {gameOver && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Pressable style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>🔁 Reiniciar</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={async () => {
              await sound1?.unloadAsync();
              await sound2?.unloadAsync();
              router.replace('/entretenimiento');
            }}
          >
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
  livesContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  life: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  pauseButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  pauseButton: {
    backgroundColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  gameOverText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

