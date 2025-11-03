import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatalogExercise } from '../constants/exerciseCatalog';
import { WEIGHT_UNITS } from '../constants/workoutTypes';

const WORKOUTS_KEY = '@app_treino:workouts';
const WORKOUT_HISTORY_KEY = '@app_treino:workout_history';
const CUSTOM_EXERCISES_KEY = '@app_treino:custom_exercises';

export type WorkoutCategory = 'chest-triceps' | 'back-biceps' | 'legs' | 'shoulders' | 'other';

export type WeightUnit = keyof typeof WEIGHT_UNITS;

export interface Set {
  number: number;
  reps: string;
  weight: string;
  weightUnit: WeightUnit;
  isCompleted?: boolean;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  imageUri?: string;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  category: WorkoutCategory;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
}

export interface WorkoutLog {
  logId: string;
  workoutId: string;
  name: string;
  completedAt: string;
  exercises: Exercise[];
}

const DEFAULT_WORKOUTS: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Academia - Peito e Tríceps',
    category: 'chest-triceps',
    exercises: [
      {
        id: '1',
        name: 'Supino Reto com Barra',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/bench-press-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '10', weightUnit: 'kg', notes: 'cada lado' },
          { number: 2, reps: '8', weight: '15', weightUnit: 'kg', notes: 'cada lado' },
          { number: 3, reps: '8', weight: '15', weightUnit: 'kg', notes: 'cada lado' }
        ]
      },
      {
        id: '2',
        name: 'Supino Inclinado com Halteres',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/incline-dumbbell-bench-press-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '20', weightUnit: 'kg', notes: 'cada lado' },
          { number: 2, reps: '8', weight: '22', weightUnit: 'kg', notes: 'cada lado' },
          { number: 3, reps: '8', weight: '24', weightUnit: 'kg', notes: 'cada lado' }
        ]
      },
      {
        id: '3',
        name: 'Voador',
        imageUri: 'https://static.strengthlevel.com/images/exercises/machine-chest-fly/machine-chest-fly-800.avif',
        sets: [
          { number: 1, reps: '10', weight: '60', weightUnit: 'kg' },
          { number: 2, reps: '8', weight: '65', weightUnit: 'kg' },
          { number: 3, reps: '8', weight: '70', weightUnit: 'kg' }
        ]
      },
      {
        id: '4',
        name: 'Cross na Polia Alta',
        imageUri: 'https://static.strengthlevel.com/images/exercises/cable-fly/cable-fly-800.avif',
        sets: [
          { number: 1, reps: '10', weight: '3', weightUnit: 'plates' },
          { number: 2, reps: '8', weight: '3', weightUnit: 'plates' },
          { number: 3, reps: '8', weight: '4', weightUnit: 'plates' }
        ]
      },
      {
        id: '5',
        name: 'Elevação lateral na Polia',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/cable-lateral-raise-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '2', weightUnit: 'plates' },
          { number: 2, reps: '8', weight: '3', weightUnit: 'plates' },
          { number: 3, reps: '8', weight: '3', weightUnit: 'plates' }
        ]
      },
      {
        id: '6',
        name: 'Tríceps Pulley na Polia',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/tricep-pushdown-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '5', weightUnit: 'plates' },
          { number: 2, reps: '8', weight: '6', weightUnit: 'plates' },
          { number: 3, reps: '8', weight: '7', weightUnit: 'plates' }
        ]
      },
      {
        id: '7',
        name: 'Tríceps Francês com Halter',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/lying-tricep-extension-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '14', weightUnit: 'kg' },
          { number: 2, reps: '8', weight: '16', weightUnit: 'kg' },
          { number: 3, reps: '8', weight: '18', weightUnit: 'kg' }
        ]
      }
    ]
  },
  {
    name: 'Academia - Costas e Bíceps',
    category: 'back-biceps',
    exercises: [
      {
        id: '8',
        name: 'Puxada alta',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/lat-pulldown-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '35', weightUnit: 'kg' },
          { number: 2, reps: '8', weight: '40', weightUnit: 'kg' },
          { number: 3, reps: '8', weight: '45', weightUnit: 'kg' }
        ]
      },
      {
        id: '9',
        name: 'Remada baixa',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/seated-cable-row-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '40', weightUnit: 'kg' },
          { number: 2, reps: '8', weight: '45', weightUnit: 'kg' },
          { number: 3, reps: '8', weight: '50', weightUnit: 'kg' }
        ]
      },
      {
        id: '10',
        name: 'Puxada invertida máquina',
        imageUri: 'https://static.strengthlevel.com/images/exercises/machine-reverse-fly/machine-reverse-fly-800.avif',
        sets: [
          { number: 1, reps: '10', weight: '30', weightUnit: 'kg', notes: 'Banco no 5' },
          { number: 2, reps: '8', weight: '35', weightUnit: 'kg', notes: 'Banco no 5' },
          { number: 3, reps: '8', weight: '45', weightUnit: 'kg', notes: 'Banco no 5' }
        ]
      },
      {
        id: '11',
        name: 'Pull Down na Polia',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/straight-arm-pulldown-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '6', weightUnit: 'plates' },
          { number: 2, reps: '8', weight: '6', weightUnit: 'plates' },
          { number: 3, reps: '8', weight: '7', weightUnit: 'plates' }
        ]
      },
      {
        id: '12',
        name: 'Bíceps Inclinado com Halteres',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/incline-dumbbell-curl-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '14', weightUnit: 'kg' },
          { number: 2, reps: '10', weight: '14', weightUnit: 'kg' },
          { number: 3, reps: '10', weight: '14', weightUnit: 'kg' }
        ]
      },
      {
        id: '13',
        name: 'Bíceps Scott',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/preacher-curl-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '4', weightUnit: 'plates' },
          { number: 2, reps: '8', weight: '5', weightUnit: 'plates' },
          { number: 3, reps: '8', weight: '6', weightUnit: 'plates' }
        ]
      }
    ]
  },
  {
    name: 'Academia - Inferiores',
    category: 'legs',
    exercises: [
      {
        id: '14',
        name: 'Abdutora',
        imageUri: 'https://static.strengthlevel.com/images/exercises/hip-abduction/hip-abduction-800.avif',
        sets: [
          { number: 1, reps: '15', weight: '5', weightUnit: 'plates' },
          { number: 2, reps: '15', weight: '6', weightUnit: 'plates' },
          { number: 3, reps: '15', weight: '6', weightUnit: 'plates' }
        ]
      },
      {
        id: '15',
        name: 'Adutora',
        imageUri: 'https://static.strengthlevel.com/images/exercises/hip-adduction/hip-adduction-800.avif',
        sets: [
          { number: 1, reps: '15', weight: '6', weightUnit: 'plates' },
          { number: 2, reps: '15', weight: '7', weightUnit: 'plates' },
          { number: 3, reps: '15', weight: '8', weightUnit: 'plates' }
        ]
      },
      {
        id: '16',
        name: 'Leg Articulado',
        imageUri: 'https://static.strengthlevel.com/images/exercises/single-leg-press/single-leg-press-800.avif',
        sets: [
          { number: 1, reps: '15', weight: '50', weightUnit: 'kg', notes: 'cada lado' },
          { number: 2, reps: '15', weight: '60', weightUnit: 'kg', notes: 'cada lado' },
          { number: 3, reps: '15', weight: '60', weightUnit: 'kg', notes: 'cada lado' }
        ]
      },
      {
        id: '17',
        name: 'Passada com halteres',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/dumbbell-lunge-1000x1000.jpg',
        sets: [
          { number: 1, reps: '30', weight: '10', weightUnit: 'kg', notes: 'cada lado' },
          { number: 2, reps: '30', weight: '10', weightUnit: 'kg', notes: 'cada lado' },
          { number: 3, reps: '30', weight: '10', weightUnit: 'kg', notes: 'cada lado' }
        ]
      },
      {
        id: '18',
        name: 'Extensora',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/leg-extension-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '10', weightUnit: 'plates' },
          { number: 2, reps: '10', weight: '12', weightUnit: 'plates' },
          { number: 3, reps: '10', weight: '13', weightUnit: 'plates' }
        ]
      },
      {
        id: '19',
        name: 'Mesa Flexora',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/lying-leg-curl-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '6', weightUnit: 'plates' },
          { number: 2, reps: '10', weight: '7', weightUnit: 'plates' },
          { number: 3, reps: '10', weight: '7', weightUnit: 'plates' }
        ]
      }
    ]
  }
];

export const storage = {
  async seedDefaultWorkouts(): Promise<void> {
    try {
      const existingWorkouts = await this.getWorkouts();
      if (existingWorkouts.length > 0) {
        return; // Não faz nada se já existirem treinos
      }

      const newWorkouts = DEFAULT_WORKOUTS.map((workout, index) => ({
        ...workout,
        id: `default_${index}_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(newWorkouts));

    } catch (error) {
      console.error('Erro ao criar treinos padrão:', error);
    }
  },

  async saveWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    try {
      const workouts = await this.getWorkouts();
      const newWorkout: Workout = {
        ...workout,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify([...workouts, newWorkout]));
      return newWorkout;
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      throw new Error('Não foi possível salvar o treino');
    }
  },

  async getWorkouts(): Promise<Workout[]> {
    try {
      const data = await AsyncStorage.getItem(WORKOUTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      return [];
    }
  },

  async updateWorkout(workout: Workout): Promise<void> {
    try {
      const workouts = await this.getWorkouts();
      const updatedWorkouts = workouts.map((w) => 
        w.id === workout.id 
          ? { ...workout, updatedAt: new Date().toISOString() }
          : w
      );
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      throw new Error('Não foi possível atualizar o treino');
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    try {
      const workouts = await this.getWorkouts();
      const filteredWorkouts = workouts.filter((w) => w.id !== id);
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      throw new Error('Não foi possível excluir o treino');
    }
  },

  async saveWorkoutToHistory(workout: Workout, completedAt?: string): Promise<void> {
    try {
      const history = await this.getWorkoutHistory();
      const newLog: WorkoutLog = {
        logId: Date.now().toString(),
        workoutId: workout.id,
        name: workout.name,
        completedAt: completedAt || new Date().toISOString(),
        exercises: workout.exercises,
      };
      await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify([newLog, ...history]));
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
      throw new Error('Não foi possível salvar o histórico de treino');
    }
  },

  async getWorkoutHistory(): Promise<WorkoutLog[]> {
    try {
      const data = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar histórico de treinos:', error);
      return [];
    }
  },

  async deleteWorkoutFromHistory(logId: string): Promise<void> {
    try {
      const history = await this.getWorkoutHistory();
      const updatedHistory = history.filter((log) => log.logId !== logId);
      await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erro ao excluir do histórico:', error);
      throw new Error('Não foi possível excluir o registro do histórico');
    }
  },

  async getCustomExercises(): Promise<CatalogExercise[]> {
    try {
      const data = await AsyncStorage.getItem(CUSTOM_EXERCISES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar exercícios personalizados:', error);
      return [];
    }
  },

  async saveCustomExercise(exercise: Omit<CatalogExercise, 'id'>): Promise<void> {
    try {
      const customExercises = await this.getCustomExercises();
      const newExercise: CatalogExercise = {
        ...exercise,
        id: `custom_${Date.now()}`,
      };
      await AsyncStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify([...customExercises, newExercise]));
    } catch (error) {
      console.error('Erro ao salvar exercício personalizado:', error);
      throw new Error('Não foi possível salvar o exercício personalizado');
    }
  },

  async updateCustomExercise(exerciseToUpdate: CatalogExercise): Promise<void> {
    try {
      const customExercises = await this.getCustomExercises();
      const updatedExercises = customExercises.map(ex => 
        ex.id === exerciseToUpdate.id ? exerciseToUpdate : ex
      );
      await AsyncStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(updatedExercises));
    } catch (error) {
      console.error('Erro ao atualizar exercício personalizado:', error);
      throw new Error('Não foi possível atualizar o exercício personalizado');
    }
  },

  async deleteCustomExercise(exerciseId: string): Promise<void> {
    try {
      const customExercises = await this.getCustomExercises();
      const updatedExercises = customExercises.filter(ex => ex.id !== exerciseId);
      await AsyncStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(updatedExercises));
    } catch (error) {
      console.error('Erro ao excluir exercício personalizado:', error);
      throw new Error('Não foi possível excluir o exercício personalizado');
    }
  },

  createDefaultSets(numberOfSets: number): Set[] {
    return Array.from({ length: numberOfSets }, (_, index) => ({
      number: index + 1,
      reps: '',
      weight: '',
      weightUnit: 'kg' as WeightUnit,
      isCompleted: false
    }));
  }
};