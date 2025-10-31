import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEIGHT_UNITS } from '../constants/workoutTypes';

const WORKOUTS_KEY = '@app_treino:workouts';

export type WorkoutCategory = 'chest-triceps' | 'back-biceps' | 'legs' | 'shoulders' | 'other';

export type WeightUnit = keyof typeof WEIGHT_UNITS;

export interface Set {
  number: number;        // Número da série
  reps: string;         // Número de repetições
  weight: string;       // Peso
  weightUnit: WeightUnit; // Unidade de medida
  isCompleted?: boolean; // Para marcar quando completar a série
  notes?: string;       // Observações adicionais (ex: "cada lado", "Banco no 5")
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];         // Array de séries em vez de campos separados
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
        id: '1',
        name: 'Puxada alta',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/lat-pulldown-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '35', weightUnit: 'kg' },
          { number: 2, reps: '8', weight: '40', weightUnit: 'kg' },
          { number: 3, reps: '8', weight: '45', weightUnit: 'kg' }
        ]
      },
      {
        id: '2',
        name: 'Remada baixa',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/seated-cable-row-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '40', weightUnit: 'kg' },
          { number: 2, reps: '8', weight: '45', weightUnit: 'kg' },
          { number: 3, reps: '8', weight: '50', weightUnit: 'kg' }
        ]
      },
      {
        id: '3',
        name: 'Puxada invertida máquina',
        imageUri: 'https://static.strengthlevel.com/images/exercises/machine-reverse-fly/machine-reverse-fly-800.avif',
        sets: [
          { number: 1, reps: '10', weight: '30', weightUnit: 'kg', notes: 'Banco no 5' },
          { number: 2, reps: '8', weight: '35', weightUnit: 'kg', notes: 'Banco no 5' },
          { number: 3, reps: '8', weight: '45', weightUnit: 'kg', notes: 'Banco no 5' }
        ]
      },
      {
        id: '4',
        name: 'Pull Down na Polia',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/straight-arm-pulldown-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '6', weightUnit: 'plates' },
          { number: 2, reps: '8', weight: '6', weightUnit: 'plates' },
          { number: 3, reps: '8', weight: '7', weightUnit: 'plates' }
        ]
      },
      {
        id: '5',
        name: 'Bíceps Inclinado com Halteres',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/incline-dumbbell-curl-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '14', weightUnit: 'kg' },
          { number: 2, reps: '10', weight: '14', weightUnit: 'kg' },
          { number: 3, reps: '10', weight: '14', weightUnit: 'kg' }
        ]
      },
      {
        id: '6',
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
        id: '1',
        name: 'Abdutora',
        imageUri: 'https://static.strengthlevel.com/images/exercises/hip-abduction/hip-abduction-800.avif',
        sets: [
          { number: 1, reps: '15', weight: '5', weightUnit: 'plates' },
          { number: 2, reps: '15', weight: '6', weightUnit: 'plates' },
          { number: 3, reps: '15', weight: '6', weightUnit: 'plates' }
        ]
      },
      {
        id: '2',
        name: 'Adutora',
        imageUri: 'https://static.strengthlevel.com/images/exercises/hip-adduction/hip-adduction-800.avif',
        sets: [
          { number: 1, reps: '15', weight: '6', weightUnit: 'plates' },
          { number: 2, reps: '15', weight: '7', weightUnit: 'plates' },
          { number: 3, reps: '15', weight: '8', weightUnit: 'plates' }
        ]
      },
      {
        id: '3',
        name: 'Leg Articulado',
        imageUri: 'https://static.strengthlevel.com/images/exercises/single-leg-press/single-leg-press-800.avif',
        sets: [
          { number: 1, reps: '15', weight: '50', weightUnit: 'kg', notes: 'cada lado' },
          { number: 2, reps: '15', weight: '60', weightUnit: 'kg', notes: 'cada lado' },
          { number: 3, reps: '15', weight: '60', weightUnit: 'kg', notes: 'cada lado' }
        ]
      },
      {
        id: '4',
        name: 'Passada com halteres',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/dumbbell-lunge-1000x1000.jpg',
        sets: [
          { number: 1, reps: '30', weight: '10', weightUnit: 'kg', notes: 'cada lado' },
          { number: 2, reps: '30', weight: '10', weightUnit: 'kg', notes: 'cada lado' },
          { number: 3, reps: '30', weight: '10', weightUnit: 'kg', notes: 'cada lado' }
        ]
      },
      {
        id: '5',
        name: 'Extensora',
        imageUri: 'https://static.strengthlevel.com/images/illustrations/leg-extension-1000x1000.jpg',
        sets: [
          { number: 1, reps: '10', weight: '10', weightUnit: 'plates' },
          { number: 2, reps: '10', weight: '12', weightUnit: 'plates' },
          { number: 3, reps: '10', weight: '13', weightUnit: 'plates' }
        ]
      },
      {
        id: '6',
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
  async initializeDefaultWorkouts(): Promise<void> {
    try {
      const existingWorkouts = await this.getWorkouts();
      
      // Só adiciona os treinos padrão se não houver nenhum treino salvo
      if (existingWorkouts.length === 0) {
        const defaultWorkoutsWithIds = DEFAULT_WORKOUTS.map((workout, index) => ({
          ...workout,
          id: `template_${index + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isTemplate: true, // Marca como template para identificar que é um treino padrão
        }));

        await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(defaultWorkoutsWithIds));
      }
    } catch (error) {
      console.error('Erro ao inicializar treinos padrão:', error);
      throw new Error('Não foi possível inicializar os treinos padrão');
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

      await AsyncStorage.setItem(
        WORKOUTS_KEY,
        JSON.stringify([...workouts, newWorkout])
      );

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

  // Helper para criar séries padrão
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