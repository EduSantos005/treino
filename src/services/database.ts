import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async (): Promise<SQLite.SQLiteDatabase> => {
  db = await SQLite.openDatabaseAsync('app.db');

  // Migration: Add duration column to workout_logs if it doesn't exist
  const columns = await db.getAllAsync<any>('PRAGMA table_info(workout_logs);');
  const hasDurationColumn = columns.some(column => column.name === 'duration');

  if (!hasDurationColumn) {
    await db.execAsync('ALTER TABLE workout_logs ADD COLUMN duration INTEGER;');
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, type TEXT);
    CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, category TEXT, image_uri TEXT);
    CREATE TABLE IF NOT EXISTS sets (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER, exercise_id INTEGER, reps INTEGER, weight REAL, weight_unit TEXT, FOREIGN KEY(workout_id) REFERENCES workouts(id), FOREIGN KEY(exercise_id) REFERENCES exercises(id));
    CREATE TABLE IF NOT EXISTS workout_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER, completed_at TEXT, workout_details TEXT, duration INTEGER);
  `);
  return db;
};

export const getDb = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};

import { exerciseCatalog } from '../constants/exerciseCatalog';

// ... (rest of the file)

const findExerciseInCatalog = (name: string) => {
  const found = exerciseCatalog.find(ex => ex.name.toLowerCase() === name.toLowerCase());
  if (!found) {
    console.warn(`Exercise "${name}" not found in catalog.`);
    return {
      name: name,
      imageUri: '',
      defaultSets: 3,
      defaultReps: 10,
    };
  }
  return found;
};

export const seedDefaultWorkouts = async (database: SQLite.SQLiteDatabase) => {
  const result = await database.getFirstAsync<{ count: number }>('SELECT COUNT(id) as count FROM workouts;');
  const count = result?.count || 0;

  if (count > 0) {
    console.log('Workouts already exist, skipping seeding.');
    return;
  }

  console.log('Seeding default workouts...');

    const defaultWorkouts = [

      {

        name: 'Academia - Costas e Bíceps',

        type: 'back-biceps',

        exercises: [

          findExerciseInCatalog('Puxada Alta pela Frente'),

          findExerciseInCatalog('Remada Baixa'),

          findExerciseInCatalog('Puxada Invertida (Máquina)'),

          findExerciseInCatalog('Pull Down na Polia (Braço Reto)'),

          findExerciseInCatalog('Bíceps Inclinado com Halteres'),

          findExerciseInCatalog('Bíceps Scott'),

        ].map((ex, index) => {

          let setsData = [];

          if (ex.name === 'Puxada Alta pela Frente') {

            setsData = [{ reps: 10, weight: 35, weight_unit: 'kg' }, { reps: 8, weight: 40, weight_unit: 'kg' }, { reps: 8, weight: 45, weight_unit: 'kg' }];

          } else if (ex.name === 'Remada Baixa') {

            setsData = [{ reps: 10, weight: 40, weight_unit: 'kg' }, { reps: 8, weight: 45, weight_unit: 'kg' }, { reps: 8, weight: 50, weight_unit: 'kg' }];

          } else if (ex.name === 'Puxada Invertida (Máquina)') {

            setsData = [{ reps: 10, weight: 30, weight_unit: 'kg' }, { reps: 8, weight: 35, weight_unit: 'kg' }, { reps: 8, weight: 45, weight_unit: 'kg' }];

          } else if (ex.name === 'Pull Down na Polia (Braço Reto)') {

            setsData = [{ reps: 12, weight: 6, weight_unit: 'plates' }, { reps: 12, weight: 6, weight_unit: 'plates' }, { reps: 12, weight: 7, weight_unit: 'plates' }];

          } else if (ex.name === 'Bíceps Inclinado com Halteres') {

            setsData = [{ reps: 10, weight: 14, weight_unit: 'kg' }, { reps: 10, weight: 14, weight_unit: 'kg' }, { reps: 10, weight: 14, weight_unit: 'kg' }];

          } else if (ex.name === 'Bíceps Scott') {

            setsData = [{ reps: 10, weight: 4, weight_unit: 'plates' }, { reps: 8, weight: 5, weight_unit: 'plates' }, { reps: 8, weight: 6, weight_unit: 'plates' }];

          } else {

            setsData = Array.from({ length: ex.defaultSets }, (_, i) => ({ number: i + 1, reps: ex.defaultReps, weight: 10, weight_unit: 'kg' }));

          }

          return {

            name: ex.name,

            imageUri: ex.imageUri,

            sets: setsData.map((set, i) => ({ ...set, number: i + 1 })),

          };

        }),

      },

      {

        name: 'Academia - Peito e Tríceps',

        type: 'chest-triceps',

        exercises: [

          findExerciseInCatalog('Supino Reto com Barra'),

          findExerciseInCatalog('Supino Inclinado com Halteres'),

          findExerciseInCatalog('Voador (Pec Deck)'),

          findExerciseInCatalog('Cross na Polia Alta'),

          findExerciseInCatalog('Elevação Lateral na Polia'),

          findExerciseInCatalog('Tríceps Pulley na Polia'),

          findExerciseInCatalog('Tríceps Francês com Halter'),

        ].map((ex, index) => {

          let setsData = [];

          if (ex.name === 'Supino Reto com Barra') {

            setsData = [{ reps: 10, weight: 10, weight_unit: 'kg' }, { reps: 8, weight: 15, weight_unit: 'kg' }, { reps: 8, weight: 15, weight_unit: 'kg' }];

          } else if (ex.name === 'Supino Inclinado com Halteres') {

            setsData = [{ reps: 10, weight: 20, weight_unit: 'kg' }, { reps: 8, weight: 22, weight_unit: 'kg' }, { reps: 8, weight: 24, weight_unit: 'kg' }];

          } else if (ex.name === 'Voador (Pec Deck)') {

            setsData = [{ reps: 10, weight: 60, weight_unit: 'kg' }, { reps: 8, weight: 65, weight_unit: 'kg' }, { reps: 8, weight: 70, weight_unit: 'kg' }];

          } else if (ex.name === 'Cross na Polia Alta') {

            setsData = [{ reps: 12, weight: 3, weight_unit: 'plates' }, { reps: 12, weight: 3, weight_unit: 'plates' }, { reps: 12, weight: 4, weight_unit: 'plates' }];

          } else if (ex.name === 'Elevação Lateral na Polia') {

            setsData = [{ reps: 12, weight: 2, weight_unit: 'plates' }, { reps: 12, weight: 2, weight_unit: 'plates' }, { reps: 12, weight: 2, weight_unit: 'plates' }];

          } else if (ex.name === 'Tríceps Pulley na Polia') {

            setsData = [{ reps: 12, weight: 5, weight_unit: 'plates' }, { reps: 12, weight: 6, weight_unit: 'plates' }, { reps: 12, weight: 7, weight_unit: 'plates' }];

          } else if (ex.name === 'Tríceps Francês com Halter') {

            setsData = [{ reps: 10, weight: 14, weight_unit: 'kg' }, { reps: 8, weight: 16, weight_unit: 'kg' }, { reps: 8, weight: 18, weight_unit: 'kg' }];

          } else {

            setsData = Array.from({ length: ex.defaultSets }, (_, i) => ({ number: i + 1, reps: ex.defaultReps, weight: 10, weight_unit: 'kg' }));

          }

          return {

            name: ex.name,

            imageUri: ex.imageUri,

            sets: setsData.map((set, i) => ({ ...set, number: i + 1 })),

          };

        }),

      },

      {

        name: 'Academia - Inferiores e Ombros',

        type: 'legs',

        exercises: [

          findExerciseInCatalog('Cadeira Abdutora'),

          findExerciseInCatalog('Cadeira Adutora'),

          findExerciseInCatalog('Leg Press Articulado'),

          findExerciseInCatalog('Passada com Halteres'),

          findExerciseInCatalog('Cadeira Extensora'),

          findExerciseInCatalog('Mesa Flexora'),

        ].map((ex, index) => {

          let setsData = [];

          if (ex.name === 'Cadeira Abdutora') {

            setsData = [{ reps: 15, weight: 5, weight_unit: 'plates' }, { reps: 15, weight: 6, weight_unit: 'plates' }, { reps: 15, weight: 6, weight_unit: 'plates' }];

          } else if (ex.name === 'Cadeira Adutora') {

            setsData = [{ reps: 15, weight: 6, weight_unit: 'plates' }, { reps: 15, weight: 7, weight_unit: 'plates' }, { reps: 15, weight: 8, weight_unit: 'plates' }];

          } else if (ex.name === 'Leg Press Articulado') {

            setsData = [{ reps: 15, weight: 50, weight_unit: 'kg' }, { reps: 15, weight: 60, weight_unit: 'kg' }, { reps: 15, weight: 60, weight_unit: 'kg' }];

          } else if (ex.name === 'Passada com Halteres') {

            setsData = [{ reps: 30, weight: 10, weight_unit: 'kg' }, { reps: 30, weight: 10, weight_unit: 'kg' }, { reps: 30, weight: 10, weight_unit: 'kg' }];

          } else if (ex.name === 'Cadeira Extensora') {

            setsData = [{ reps: 10, weight: 10, weight_unit: 'plates' }, { reps: 10, weight: 12, weight_unit: 'plates' }, { reps: 10, weight: 13, weight_unit: 'plates' }];

          } else if (ex.name === 'Mesa Flexora') {

            setsData = [{ reps: 10, weight: 6, weight_unit: 'plates' }, { reps: 10, weight: 7, weight_unit: 'plates' }, { reps: 10, weight: 7, weight_unit: 'plates' }];

          } else {

            setsData = Array.from({ length: ex.defaultSets }, (_, i) => ({ number: i + 1, reps: ex.defaultReps, weight: 10, weight_unit: 'kg' }));

          }

          return {

            name: ex.name,

            imageUri: ex.imageUri,

            sets: setsData.map((set, i) => ({ ...set, number: i + 1 })),

          };

        }),

      },

    ];

  for (const workout of defaultWorkouts) {
    console.log(`Inserting workout: ${workout.name}`);
    const now = new Date().toISOString();
    const workoutResult = await database.runAsync(
      'INSERT INTO workouts (name, date, type) VALUES (?, ?, ?);',
      workout.name,
      now,
      workout.type
    );
    const workoutId = workoutResult.lastInsertRowId;

    if (workoutId) {
      for (const exercise of workout.exercises) {
        let exerciseId: number | null = null;
        const existingExercise = await database.getFirstAsync<{ id: number }>(
          'SELECT id FROM exercises WHERE name = ?;',
          exercise.name
        );

        if (existingExercise) {
          exerciseId = existingExercise.id;
          await database.runAsync(
            'UPDATE exercises SET image_uri = ? WHERE id = ?;',
            exercise.imageUri || null,
            exerciseId
          );
        } else {
          const exerciseResult = await database.runAsync(
            'INSERT INTO exercises (name, category, image_uri) VALUES (?, ?, ?);',
            exercise.name,
            'default', // You might want to define categories for default exercises
            exercise.imageUri || null
          );
          exerciseId = exerciseResult.lastInsertRowId;
        }

        if (exerciseId) {
          for (const set of exercise.sets) {
            await database.runAsync(
              'INSERT INTO sets (workout_id, exercise_id, reps, weight, weight_unit) VALUES (?, ?, ?, ?, ?);',
              workoutId,
              exerciseId,
              set.reps,
              set.weight,
              set.weight_unit // Use the correct weight unit from set data
            );
          }
        }
      }
    }
  }
  console.log('Default workouts seeded successfully.');
};

export const clearDatabase = async (database: SQLite.SQLiteDatabase) => {
  await database.execAsync(`
    DELETE FROM sets;
    DELETE FROM workout_logs;
    DELETE FROM exercises;
    DELETE FROM workouts;
  `);
  console.log('Database cleared.');
};