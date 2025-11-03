export type WorkoutCategory = 'chest-triceps' | 'back-biceps' | 'legs' | 'shoulders' | 'other';

export const WORKOUT_CATEGORIES: { [key in WorkoutCategory]: string } = {
  'chest-triceps': 'Peito e Tríceps',
  'back-biceps': 'Costas e Bíceps',
  'legs': 'Pernas',
  'shoulders': 'Ombros',
  'other': 'Outro'
};

export const WEIGHT_UNITS = {
  kg: 'Quilogramas (kg)',
  plates: 'Placas',
  lbs: 'Libras (lbs)'
} as const;

export const getCategoryLabel = (category: WorkoutCategory | string): string => {
  if (WORKOUT_CATEGORIES[category as WorkoutCategory]) {
    return WORKOUT_CATEGORIES[category as WorkoutCategory];
  }
  return category || 'Desconhecido';
};

export const getWeightUnitLabel = (unit: keyof typeof WEIGHT_UNITS): string => {
  return WEIGHT_UNITS[unit];
};