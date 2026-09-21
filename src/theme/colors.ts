export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#2563EB',
    600: '#1D4ED8',
    700: '#1E40AF',
  },
} as const;

export const statusColors: Record<string, string> = {
  quero_ler: 'bg-slate-200 text-slate-700',
  lendo: 'bg-primary-100 text-primary-700',
  lido: 'bg-green-100 text-green-700',
};
