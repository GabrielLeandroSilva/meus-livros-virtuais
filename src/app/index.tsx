import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { CardLivro } from '../components/CardLivro';
import { EmptyState, SearchBar } from '../components/SearchBar';
import { initDb } from '../db/client';
import { listBooks } from '../features/books/repository';
import type { Book } from '../features/books/types';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');

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
      setBooks(await listBooks(search));
    }, 300);
    return () => clearTimeout(t);
  }, [search, ready]);

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-primary-600">Meus Livros Virtuais</Text>
      <Text className="mt-1 text-slate-500">
        {ready ? `${books.length} livro(s) na estante local (SQLite)` : 'Abrindo banco local...'}
      </Text>
      <View className="mt-4">
        <SearchBar value={search} onChangeText={setSearch} />
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
        renderItem={({ item }) => <CardLivro book={item} />}
        ListFooterComponent={
          ready ? (
            <View className="mt-2">
              {/* TODO Passo 3: navegar para /form */}
              <Button title="+ Adicionar livro" onPress={() => {}} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
