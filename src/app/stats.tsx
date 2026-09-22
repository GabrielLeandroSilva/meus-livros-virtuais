import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getStats, type BookStats } from '../features/books/repository';

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="mb-3 w-[48%] rounded-2xl border border-slate-200 bg-white p-4">
      <Ionicons name={icon} size={22} color="#1D4ED8" />
      <Text className="mt-2 text-2xl font-bold text-primary-600">{value}</Text>
      <Text className="mt-1 text-sm font-medium text-slate-700">{label}</Text>
      {sub ? <Text className="text-xs text-slate-400">{sub}</Text> : null}
    </View>
  );
}

export default function Stats() {
  const [stats, setStats] = useState<BookStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => setStats(await getStats()))();
    }, []),
  );

  if (!stats) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Calculando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 px-4 py-4">
      <Text className="mb-1 text-xl font-bold text-slate-900">Minha estante em números</Text>
      <Text className="mb-4 text-sm text-slate-500">{stats.pctLidos}% dos livros já lidos</Text>
      <View className="flex-row flex-wrap justify-between">
        <StatCard label="Total de livros" value={String(stats.total)} icon="library-outline" />
        <StatCard label="Lidos" value={String(stats.lidos)} sub={`${stats.pctLidos}%`} icon="checkmark-circle-outline" />
        <StatCard label="Lendo agora" value={String(stats.lendo)} icon="time-outline" />
        <StatCard label="Quero ler" value={String(stats.queroLer)} icon="bookmark-outline" />
        <StatCard label="Nota média" value={stats.mediaNotas ? String(stats.mediaNotas) : '—'} icon="star-outline" />
        <StatCard label="Páginas somadas" value={String(stats.totalPaginas)} icon="document-text-outline" />
      </View>
    </ScrollView>
  );
}
