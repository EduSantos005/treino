export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'abs'
  | 'cardio';

export type ExerciseCategory = {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
};

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Peito',
  back: 'Costas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  legs: 'Pernas',
  abs: 'Abdômen',
  cardio: 'Cardio',
};

export const exerciseCategories: ExerciseCategory[] = [
  {
    id: 'chest-triceps',
    name: 'Peito e Tríceps',
    muscleGroups: ['chest', 'triceps'],
  },
  {
    id: 'back-biceps',
    name: 'Costas e Bíceps',
    muscleGroups: ['back', 'biceps'],
  },
  {
    id: 'legs',
    name: 'Pernas',
    muscleGroups: ['legs'],
  },
  {
    id: 'shoulders',
    name: 'Ombros',
    muscleGroups: ['shoulders'],
  },
  {
    id: 'abs',
    name: 'Abdômen',
    muscleGroups: ['abs'],
  },
];