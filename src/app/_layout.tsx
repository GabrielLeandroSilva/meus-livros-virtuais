import { Stack } from 'expo-router';
import '../../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Meus Livros Virtuais' }} />
      <Stack.Screen name="form" options={{ title: 'Cadastrar livro' }} />
      <Stack.Screen name="book/[id]" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="stats" options={{ title: 'Estatísticas' }} />
    </Stack>
  );
}
