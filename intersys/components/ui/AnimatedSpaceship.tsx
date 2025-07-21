import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import { Animated, Image, StyleSheet, Dimensions, View } from 'react-native';

import spaceshipImg from '@/assets/images/nave.png';

export type AnimatedSpaceshipHandle = {
  shake: () => void;
};

const { width } = Dimensions.get('window');

type Props = {
  x: number;
  y: number;
};

const AnimatedSpaceship = forwardRef<AnimatedSpaceshipHandle, Props>(({ x, y }, ref) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  const triggerFlash = () => {
    flashAnim.setValue(0.5);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useImperativeHandle(ref, () => ({
    shake() {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      triggerFlash();
    },
  }));

  return (
    <Animated.View
      style={[
        styles.ship,
        {
          transform: [
            { translateX: x },
            { translateY: y },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <Image source={spaceshipImg} style={{ width: 80, height: 80 }} resizeMode="contain" />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'red', opacity: flashAnim, borderRadius: 50 },
        ]}
      />
    </Animated.View>
  );
});

export default AnimatedSpaceship;

const styles = StyleSheet.create({
  ship: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
});
