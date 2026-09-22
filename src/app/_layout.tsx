import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import '../../global.css';
import { initDb } from '../db/client';
import { AnimatedSplash } from '../components/AnimatedSplash';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDb();
        // Tempo mínimo para a animação da splash ser apreciada
        await new Promise((r) => setTimeout(r, 1800));
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  if (!appReady) return <AnimatedSplash />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1D4ED8' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Meus Livros Virtuais',
          headerRight: () => (
            <Pressable onPress={() => router.push('/stats')} hitSlop={10} style={{ marginRight: 4 }}>
              <Ionicons name="stats-chart-outline" size={22} color="#FFFFFF" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="form" options={{ title: 'Cadastrar livro' }} />
      <Stack.Screen name="book/[id]" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="stats" options={{ title: 'Estatísticas' }} />
      <Stack.Screen name="scan" options={{ title: 'Escanear livro' }} />
    </Stack>
  );
}
