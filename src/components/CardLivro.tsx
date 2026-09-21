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
      className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 active:opacity-80"
    >
      <View className="mb-2 flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-900" numberOfLines={2}>
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
      <View className="mt-2">
        <RatingStars value={book.nota} />
      </View>
    </Pressable>
  );
}
