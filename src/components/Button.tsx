import { Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

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

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl px-4 py-3 ${styles[variant]} ${disabled ? 'opacity-50' : 'active:opacity-80'}`}
    >
      <Text className={`text-center text-base font-semibold ${textStyles[variant]}`}>{title}</Text>
    </Pressable>
  );
}
