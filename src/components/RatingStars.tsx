import { Pressable, Text, View } from 'react-native';

interface Props {
  value: number; // 0-5
  onRate?: (n: number) => void;
  size?: number;
}

export function RatingStars({ value, onRate, size = 26 }: Props) {
  return (
    <View className="flex-row items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= Math.round(value);
        const star = (
          <Text
            key={n}
            style={{ fontSize: size, color: active ? '#FBBF24' : '#CBD5E1' }}
          >
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
