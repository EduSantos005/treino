import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatalogExercise } from '../constants/exerciseCatalog';
import { WEIGHT_UNITS } from '../constants/workoutTypes';
import { getDb } from './database';

const WORKOUT_HISTORY_KEY = '@app_treino:workout_history';
const CUSTOM_EXERCISES_KEY = '@app_treino:custom_exercises';

export type WorkoutCategory = 'chest-triceps' | 'back-biceps' | 'legs' | 'shoulders' | 'other';

export type WeightUnit = keyof typeof WEIGHT_UNITS;

export interface Set {
  id: number;
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
  category?: string;
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
  lastTrained?: string; // Nova propriedade
}

export interface WorkoutLog {
  logId: string;
  workoutId: string;
  name: string;
  completedAt: string;
  exercises: Exercise[];
  duration?: number;
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

  async saveWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    const database = getDb();
    const now = new Date().toISOString();

    // Inserir o treino sem especificar o ID, deixando o AUTOINCREMENT cuidar disso
    const workoutResult = await database.runAsync(
      'INSERT INTO workouts (name, category, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
      [workout.name, workout.category, now, now]
    );
    const workoutId = workoutResult.lastInsertRowId; // Obter o ID gerado pelo banco de dados

    if (!workoutId) {
      throw new Error('Failed to get workout ID after insertion.');
    }

    const newWorkout: Workout = {
      ...workout,
      id: workoutId.toString(), // Usar o ID gerado pelo banco de dados
      createdAt: now,
      updatedAt: now,
    };

    for (const exercise of newWorkout.exercises) {
      let exerciseId: number | null = null;
      const existingExercise = await database.getFirstAsync<{ id: number }>(
        'SELECT id FROM exercises WHERE name = ?;',
        exercise.name
      );

      if (existingExercise) {
        exerciseId = existingExercise.id;
      } else {
        const exerciseResult = await database.runAsync(
          'INSERT INTO exercises (name, category, image_uri) VALUES (?, ?, ?);',
          exercise.name,
          exercise.category || 'default',
          exercise.imageUri || null
        );
        exerciseId = exerciseResult.lastInsertRowId;
      }

      if (exerciseId) {
        for (const set of exercise.sets) {
          await database.runAsync(
            'INSERT INTO sets (workout_id, exercise_id, reps, weight, weight_unit) VALUES (?, ?, ?, ?, ?);',
            workoutId, // Usar o workoutId gerado pelo banco de dados
            exerciseId,
            set.reps,
            set.weight,
            set.weightUnit
          );
        }
      }
    }
    return newWorkout;
  },

  async getWorkouts(): Promise<Workout[]> {
    const database = getDb();
    const rawWorkouts = await database.getAllAsync<any>(
      `SELECT
        w.id as workout_id,
        w.name as workout_name,
        w.date,
        w.category,
        w.createdAt,
        w.updatedAt,
        e.id as exercise_id,
        e.name as exercise_name,
        e.category as exercise_category,
        e.image_uri as exercise_image_uri,
        s.id as set_id,
        s.reps,
        s.weight,
        s.weight_unit
      FROM workouts w
      LEFT JOIN sets s ON w.id = s.workout_id
      LEFT JOIN exercises e ON s.exercise_id = e.id
      ORDER BY w.id, e.id, s.id;`
    );

    const workoutsMap = new Map<string, Workout>();
    const workoutLogs = await this.getWorkoutHistory(); // Obter o histórico de treinos

    rawWorkouts.forEach((row: any) => {
      if (!row.workout_id) return; // Skip if no workout data

      let workout = workoutsMap.get(row.workout_id);
      if (!workout) {
        workout = {
          id: row.workout_id.toString(),
          name: row.workout_name,
          date: row.date,
          category: row.category,
          exercises: [],
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };
        workoutsMap.set(row.workout_id, workout);
      }

      if (row.exercise_id) {
        let exercise = workout.exercises.find(ex => ex.id === row.exercise_id.toString());
        if (!exercise) {
          exercise = {
            id: row.exercise_id.toString(),
            name: row.exercise_name,
            sets: [],
            category: row.exercise_category,
            imageUri: row.exercise_image_uri,
          };
          workout.exercises.push(exercise);
        }

        if (row.set_id) {
          exercise.sets.push({
            id: row.set_id,
            number: exercise.sets.length + 1, // Assign a number for display
            reps: row.reps.toString(),
            weight: row.weight.toString(),
            weightUnit: (row.weight_unit || 'kg') as WeightUnit,
            isCompleted: false, // Default value
          });
        }
      }
    });

    // Adicionar a data do último treino realizado
    const workoutsWithLastTrained = Array.from(workoutsMap.values()).map(workout => {
      const lastLog = workoutLogs
        .filter(log => log.workoutId === workout.id)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
      
      return {
        ...workout,
        lastTrained: lastLog ? lastLog.completedAt : undefined,
      };
    });

    return workoutsWithLastTrained;
  },

  async updateWorkout(workout: Workout): Promise<void> {
    const database = getDb();
    const updatedAt = new Date().toISOString();
    const workoutDbId = parseInt(workout.id, 10); // Converter para número

    await database.runAsync(
      'UPDATE workouts SET name = ?, category = ?, updatedAt = ? WHERE id = ?',
      [workout.name, workout.category, updatedAt, workoutDbId]
    );

    // Delete old sets and exercises for this workout
    await database.runAsync('DELETE FROM sets WHERE workout_id = ?;', workoutDbId); // Usar workoutDbId
    // Note: We are not deleting exercises from the exercises table here,
    // as they might be linked to other workouts. This is a simplification.

    for (const exercise of workout.exercises) {
      let exerciseId: number | null = null;
      const existingExercise = await database.getFirstAsync<{ id: number }>(
        'SELECT id FROM exercises WHERE name = ?;',
        exercise.name
      );

      if (existingExercise) {
        exerciseId = existingExercise.id;
        // Atualizar o image_uri para o exercício existente
        await database.runAsync(
          'UPDATE exercises SET category = ?, image_uri = ? WHERE id = ?;',
          exercise.category || 'default',
          exercise.imageUri || null,
          exerciseId
        );
      } else {
        const exerciseResult = await database.runAsync(
          'INSERT INTO exercises (name, category, image_uri) VALUES (?, ?, ?);',
          exercise.name,
          exercise.category || 'default',
          exercise.imageUri || null
        );
        exerciseId = exerciseResult.lastInsertRowId;
      }

      if (exerciseId) {
        for (const set of exercise.sets) {
          await database.runAsync(
            'INSERT INTO sets (workout_id, exercise_id, reps, weight, weight_unit) VALUES (?, ?, ?, ?, ?);',
            workoutDbId, // Usar workoutDbId
            exerciseId,
            set.reps,
            set.weight,
            set.weightUnit
          );
        }
      }
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM workouts WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  async saveWorkoutToHistory(workout: Workout, completedAt?: string, duration?: number): Promise<void> {
    try {
      const db = getDb();
      const completed_at = completedAt || new Date().toISOString();
      const workout_details = JSON.stringify(workout.exercises);
      
      await db.runAsync(
        'INSERT INTO workout_logs (workout_id, completed_at, workout_details, duration) VALUES (?, ?, ?, ?);',
        [parseInt(workout.id, 10), completed_at, workout_details, duration]
      );
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
      throw new Error('Não foi possível salvar o histórico de treino');
    }
  },

  async getWorkoutHistory(): Promise<WorkoutLog[]> {
    try {
      const db = getDb();
      const logs = await db.getAllAsync<any>(`
        SELECT
          wl.id as logId,
          wl.workout_id as workoutId,
          w.name as name,
          wl.completed_at as completedAt,
          wl.workout_details as exercises,
          wl.duration as duration
        FROM workout_logs wl
        JOIN workouts w ON wl.workout_id = w.id
        ORDER BY wl.completed_at DESC;
      `);

      return logs.map(log => {
        let parsedExercises = [];
        try {
          const rawDetails = log.exercises;
          if (rawDetails) {
            const parsed = JSON.parse(rawDetails);
            if (Array.isArray(parsed)) {
              parsedExercises = parsed;
            } else {
              console.warn('Parsed workout_details is not an array:', parsed);
            }
          }
        } catch (e) {
          console.error('Error parsing workout_details:', e, 'Raw data:', log.exercises);
        }

        return {
          ...log,
          logId: log.logId.toString(),
          workoutId: log.workoutId.toString(),
          exercises: parsedExercises
        };
      });
    } catch (error) {
      console.error('Erro ao buscar histórico de treinos:', error);
      return [];
    }
  },

  async deleteWorkoutFromHistory(logId: string): Promise<void> {
    try {
      const db = getDb();
      await db.runAsync('DELETE FROM workout_logs WHERE id = ?;', [parseInt(logId, 10)]);
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
      id: Date.now() + index + Math.random(), // Gerar um ID único para cada set
      number: index + 1,
      reps: '',
      weight: '',
      weightUnit: 'kg' as WeightUnit,
      isCompleted: false
    }));
  }
};