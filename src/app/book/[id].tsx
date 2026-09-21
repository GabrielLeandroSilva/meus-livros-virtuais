import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { BadgeStatus } from '../../components/BadgeStatus';
import { Button } from '../../components/Button';
import { RatingStars } from '../../components/RatingStars';
import { deleteBook, getBook } from '../../features/books/repository';
import type { Book } from '../../features/books/types';

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookId = Number(id);
  const [book, setBook] = useState<Book | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => setBook(await getBook(bookId)))();
    }, [bookId]),
  );

  function onDelete() {
    Alert.alert('Excluir livro', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteBook(bookId);
          router.back();
        },
      },
    ]);
  }

  if (!book) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Carregando...</Text>
      </View>
    );
  }

  const meta = [book.editora, book.ano ? String(book.ano) : null, book.genero].filter(Boolean).join(' • ');

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <BadgeStatus status={book.status} />
      <Text className="mt-2 text-2xl font-bold text-slate-900">{book.titulo}</Text>
      <Text className="mt-1 text-base text-slate-500">{book.autor}</Text>
      {meta ? <Text className="mt-1 text-sm text-slate-400">{meta}</Text> : null}
      <View className="mt-3">
        <RatingStars value={book.nota} />
      </View>
      {book.isbn ? <Text className="mt-3 text-sm text-slate-600">ISBN: {book.isbn}</Text> : null}
      {book.paginas ? <Text className="mt-1 text-sm text-slate-600">{book.paginas} páginas</Text> : null}
      {book.descricao ? <Text className="mt-3 text-base leading-6 text-slate-700">{book.descricao}</Text> : null}
      <View className="mb-8 mt-6 gap-2">
        <Button title="Editar" onPress={() => router.push(`/form?id=${bookId}`)} />
        <Button title="Excluir" variant="danger" onPress={onDelete} />
      </View>
    </ScrollView>
  );
}
