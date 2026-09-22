import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export function AnimatedSplash() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(titleY, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity, titleY]);

  return (
    <View className="flex-1 items-center justify-center bg-primary-700">
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Ionicons name="book" size={96} color="#FFFFFF" />
      </Animated.View>
      <Animated.View style={{ opacity, transform: [{ translateY: titleY }] }} className="items-center">
        <Text className="mt-4 text-2xl font-bold text-white">Meus Livros Virtuais</Text>
        <Text className="mt-1 text-sm text-primary-100">Sua estante virtual</Text>
      </Animated.View>
    </View>
  );
}
