import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Book } from '../features/books/types';
import { BadgeStatus } from './BadgeStatus';
import { RatingStars } from './RatingStars';

interface Props {
  book: Book;
  onPress?: () => void;
}

export function CardLivro({ book, onPress }: Props) {
  const meta = [book.genero, book.ano ? String(book.ano) : null].filter(Boolean).join(' • ');
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row overflow-hidden rounded-l-md rounded-r-2xl border border-slate-200 bg-white active:opacity-80"
    >
      {/* Lombada do livro */}
      <View className="w-2 bg-primary-700" />
      {/* Capa */}
      <View className="items-center justify-center bg-primary-50 px-4">
        <Ionicons name="book" size={32} color="#1D4ED8" />
      </View>
      {/* Miolo com as informações */}
      <View className="flex-1 p-3">
        <View className="mb-1 flex-row items-start justify-between gap-2">
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-900" numberOfLines={2}>
              {book.titulo}
            </Text>
            <Text className="mt-0.5 text-sm text-slate-500" numberOfLines={1}>
              {book.autor}
            </Text>
          </View>
          <BadgeStatus status={book.status} />
        </View>
        {meta ? (
          <Text className="text-xs text-slate-400" numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
        <View className="mt-1.5">
          <RatingStars value={book.nota} />
        </View>
      </View>
      {/* Corte das páginas */}
      <View className="w-1.5 border-l border-slate-200 bg-slate-50" />
    </Pressable>
  );
}
