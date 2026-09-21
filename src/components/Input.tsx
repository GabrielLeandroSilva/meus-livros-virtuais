import { Text, TextInput, View } from 'react-native';

interface Props {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
}

export function Input({ label, value, onChangeText, placeholder, error, multiline }: Props) {
  return (
    <View className="mb-3">
      {label ? <Text className="mb-1 text-sm font-medium text-slate-700">{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        className={`rounded-xl border bg-white px-3 py-2.5 text-base text-slate-900 ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
        placeholderTextColor="#94A3B8"
      />
      {error ? <Text className="mt-1 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}
