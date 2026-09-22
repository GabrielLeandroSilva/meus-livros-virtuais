import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonIcon = keyof typeof Ionicons.glyphMap;

const styles: Record<Variant, string> = {
  primary: 'bg-primary-600',
  secondary: 'bg-slate-200',
  danger: 'bg-red-600',
  ghost: 'bg-transparent border border-slate-300',
};

const textStyles: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-slate-800',
  danger: 'text-white',
  ghost: 'text-slate-700',
};

const iconColors: Record<Variant, string> = {
  primary: '#FFFFFF',
  secondary: '#1E293B',
  danger: '#FFFFFF',
  ghost: '#334155',
};

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: ButtonIcon;
}

export function Button({ title, onPress, variant = 'primary', disabled = false, icon }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl px-4 py-3 ${styles[variant]} ${disabled ? 'opacity-50' : 'active:opacity-80'}`}
    >
      <View className="flex-row items-center justify-center gap-2">
        {icon ? <Ionicons name={icon} size={18} color={iconColors[variant]} /> : null}
        <Text className={`text-center text-base font-semibold ${textStyles[variant]}`}>{title}</Text>
      </View>
    </Pressable>
  );
}
