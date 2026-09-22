import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import '../../global.css';

export default function RootLayout() {
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
