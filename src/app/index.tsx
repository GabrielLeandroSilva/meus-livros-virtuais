import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { initDb } from '../db/client';
import { listBooks } from '../features/books/repository';
import type { Book } from '../features/books/types';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initDb();
      setBooks(await listBooks());
      setReady(true);
    })();
  }, []);

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-primary-600">Meus Livros Virtuais</Text>
      <Text className="mt-1 text-slate-500">
        {ready ? `${books.length} livro(s) na estante local (SQLite)` : 'Abrindo banco local...'}
      </Text>
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={
          ready ? (
            <Text className="mt-8 text-center text-slate-400">
              Nenhum livro ainda. Próximo passo: tela de cadastro.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View className="mb-3 rounded-xl border border-slate-200 p-3">
            <Text className="text-lg font-semibold">{item.titulo}</Text>
            <Text className="text-slate-500">{item.autor}</Text>
          </View>
        )}
      />
    </View>
  );
}
