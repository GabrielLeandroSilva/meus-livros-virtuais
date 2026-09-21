import { Pressable, Text, View } from 'react-native';

interface Props {
  value: number; // 0-5
  onRate?: (n: number) => void;
}

export function RatingStars({ value, onRate }: Props) {
  return (
    <View className="flex-row items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= Math.round(value);
        const star = (
          <Text key={n} className={`text-lg ${active ? 'text-amber-400' : 'text-slate-300'}`}>
            ★
          </Text>
        );
        if (!onRate) return star;
        return (
          <Pressable key={n} onPress={() => onRate(n)} hitSlop={8}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}
