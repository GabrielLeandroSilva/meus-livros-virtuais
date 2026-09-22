import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { CardLivro } from '../components/CardLivro';
import { EmptyState, SearchBar } from '../components/SearchBar';
import { initDb } from '../db/client';
import { listBooks } from '../features/books/repository';
import type { Book, BookStatus } from '../features/books/types';

type Filter = BookStatus | 'todos';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'quero_ler', label: 'Quero ler' },
  { value: 'lendo', label: 'Lendo' },
  { value: 'lido', label: 'Lidos' },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('todos');

  useEffect(() => {
    (async () => {
      await initDb();
      setBooks(await listBooks());
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(async () => {
      setBooks(await listBooks(search, filter));
    }, 300);
    return () => clearTimeout(t);
  }, [search, filter, ready]);

  useFocusEffect(
    useCallback(() => {
      if (!ready) return;
      (async () => setBooks(await listBooks(search, filter)))();
    }, [ready, search, filter]),
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Text className="text-slate-500">
        {ready ? `Sua estante tem ${books.length} livro(s)` : 'Abrindo sua estante...'}
      </Text>
      <View className="mt-4">
        <SearchBar value={search} onChangeText={setSearch} />
      </View>
      <View className="mb-2 flex-row gap-2">
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1.5 ${filter === f.value ? 'bg-primary-600' : 'bg-slate-200'}`}
          >
            <Text className={`text-xs font-semibold ${filter === f.value ? 'text-white' : 'text-slate-700'}`}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          ready ? (
            <EmptyState
              title="Estante vazia"
              message="Cadastre seu primeiro livro pelo formulário ou escaneando o ISBN."
            />
          ) : null
        }
        renderItem={({ item }) => <CardLivro book={item} onPress={() => router.push(`/book/${item.id}`)} />}
        ListFooterComponent={
          ready ? (
            <View className="mt-2 gap-2">
              <Button title="Adicionar livro" icon="add" onPress={() => router.push('/form')} />
              <Button title="Escanear ISBN" icon="camera-outline" variant="secondary" onPress={() => router.push('/scan')} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
