import { Text, View } from 'react-native';
import type { BookStatus } from '../features/books/types';

const labels: Record<BookStatus, string> = {
  quero_ler: 'Quero ler',
  lendo: 'Lendo',
  lido: 'Lido',
};

const bg: Record<BookStatus, string> = {
  quero_ler: 'bg-slate-200',
  lendo: 'bg-primary-100',
  lido: 'bg-green-100',
};

const fg: Record<BookStatus, string> = {
  quero_ler: 'text-slate-700',
  lendo: 'text-primary-700',
  lido: 'text-green-700',
};

export function BadgeStatus({ status }: { status: BookStatus }) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${bg[status]}`}>
      <Text className={`text-xs font-semibold ${fg[status]}`}>{labels[status]}</Text>
    </View>
  );
}
