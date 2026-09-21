import { Text, TextInput, View } from 'react-native';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar por título ou autor...' }: Props) {
  return (
    <View className="mb-3 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        className="py-2 text-base text-slate-900"
        returnKeyType="search"
      />
    </View>
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center px-6 py-10">
      <Text className="text-4xl">📚</Text>
      <Text className="mt-3 text-lg font-bold text-slate-800">{title}</Text>
      <Text className="mt-1 text-center text-sm text-slate-500">{message}</Text>
      {actionLabel && onAction ? (
        <Text onPress={onAction} className="mt-4 text-base font-semibold text-primary-600">
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}
