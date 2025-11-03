import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async (): Promise<SQLite.SQLiteDatabase> => {
  db = await SQLite.openDatabaseAsync('app.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, type TEXT);
    CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, category TEXT, image_uri TEXT);
    CREATE TABLE IF NOT EXISTS sets (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER, exercise_id INTEGER, reps INTEGER, weight REAL, weight_unit TEXT, FOREIGN KEY(workout_id) REFERENCES workouts(id), FOREIGN KEY(exercise_id) REFERENCES exercises(id));
    CREATE TABLE IF NOT EXISTS workout_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER, completed_at TEXT, workout_details TEXT);
  `);
  return db;
};

export const getDb = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
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
      name: 'Academia - Peito e Tríceps',
      type: 'chest-triceps',
      exercises: [
        {
          name: 'Supino Reto com Barra',
          sets: [
            { reps: 10, weight: 10, weight_unit: 'kg' },
            { reps: 8, weight: 15, weight_unit: 'kg' },
            { reps: 8, weight: 15, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Supino Inclinado com Halteres',
          sets: [
            { reps: 10, weight: 20, weight_unit: 'kg' },
            { reps: 8, weight: 22, weight_unit: 'kg' },
            { reps: 8, weight: 24, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Voador',
          sets: [
            { reps: 10, weight: 60, weight_unit: 'kg' },
            { reps: 8, weight: 65, weight_unit: 'kg' },
            { reps: 8, weight: 70, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Cross na Polia Alta',
          sets: [
            { reps: 10, weight: 3, weight_unit: 'plates' },
            { reps: 8, weight: 3, weight_unit: 'plates' },
            { reps: 8, weight: 4, weight_unit: 'plates' }
          ]
        },
        {
          name: 'Tríceps Pulley na Polia',
          sets: [
            { reps: 10, weight: 5, weight_unit: 'plates' },
            { reps: 8, weight: 6, weight_unit: 'plates' },
            { reps: 8, weight: 7, weight_unit: 'plates' }
          ]
        },
        {
          name: 'Tríceps Francês com Halter',
          sets: [
            { reps: 10, weight: 14, weight_unit: 'kg' },
            { reps: 8, weight: 16, weight_unit: 'kg' },
            { reps: 8, weight: 18, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Tríceps Testa com Barra',
          sets: [
            { reps: 10, weight: 10, weight_unit: 'kg' },
            { reps: 8, weight: 12, weight_unit: 'kg' },
            { reps: 8, weight: 14, weight_unit: 'kg' }
          ]
        }
      ]
    },
    {
      name: 'Academia - Costas e Bíceps',
      type: 'back-biceps',
      exercises: [
        {
          name: 'Puxada alta',
          sets: [
            { reps: 10, weight: 35, weight_unit: 'kg' },
            { reps: 8, weight: 40, weight_unit: 'kg' },
            { reps: 8, weight: 45, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Remada baixa',
          sets: [
            { reps: 10, weight: 40, weight_unit: 'kg' },
            { reps: 8, weight: 45, weight_unit: 'kg' },
            { reps: 8, weight: 50, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Remada Curvada com Barra',
          sets: [
            { reps: 10, weight: 20, weight_unit: 'kg' },
            { reps: 8, weight: 25, weight_unit: 'kg' },
            { reps: 8, weight: 30, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Bíceps Inclinado com Halteres',
          sets: [
            { reps: 10, weight: 14, weight_unit: 'kg' },
            { reps: 10, weight: 14, weight_unit: 'kg' },
            { reps: 10, weight: 14, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Bíceps Scott',
          sets: [
            { reps: 10, weight: 4, weight_unit: 'plates' },
            { reps: 8, weight: 5, weight_unit: 'plates' },
            { reps: 8, weight: 6, weight_unit: 'plates' }
          ]
        },
        {
          name: 'Rosca Concentrada',
          sets: [
            { reps: 10, weight: 8, weight_unit: 'kg' },
            { reps: 8, weight: 10, weight_unit: 'kg' },
            { reps: 8, weight: 12, weight_unit: 'kg' }
          ]
        }
      ]
    },
    {
      name: 'Academia - Inferiores e Ombros',
      type: 'legs',
      exercises: [
        {
          name: 'Abdutora',
          sets: [
            { reps: 15, weight: 5, weight_unit: 'plates' },
            { reps: 15, weight: 6, weight_unit: 'plates' },
            { reps: 15, weight: 6, weight_unit: 'plates' }
          ]
        },
        {
          name: 'Adutora',
          sets: [
            { reps: 15, weight: 6, weight_unit: 'plates' },
            { reps: 15, weight: 7, weight_unit: 'plates' },
            { reps: 15, weight: 8, weight_unit: 'plates' }
          ]
        },
        {
          name: 'Leg Articulado',
          sets: [
            { reps: 15, weight: 50, weight_unit: 'kg' },
            { reps: 15, weight: 60, weight_unit: 'kg' },
            { reps: 15, weight: 60, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Passada com halteres',
          sets: [
            { reps: 30, weight: 10, weight_unit: 'kg' },
            { reps: 30, weight: 10, weight_unit: 'kg' },
            { reps: 30, weight: 10, weight_unit: 'kg' }
          ]
        },
        {
          name: 'Extensora',
          sets: [
            { reps: 10, weight: 10, weight_unit: 'plates' },
            { reps: 10, weight: 12, weight_unit: 'plates' },
            { reps: 10, weight: 13, weight_unit: 'plates' }
          ]
        },
        {
          name: 'Mesa Flexora',
          sets: [
            { reps: 10, weight: 6, weight_unit: 'plates' },
            { reps: 10, weight: 7, weight_unit: 'plates' },
            { reps: 10, weight: 7, weight_unit: 'plates' }
          ]
        }
      ]
    }
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
        // Insert exercise if it doesn't exist
        let exerciseId: number | null = null;
        const existingExercise = await database.getFirstAsync<{ id: number }>(
          'SELECT id FROM exercises WHERE name = ?;',
          exercise.name
        );

        if (existingExercise) {
          exerciseId = existingExercise.id;
        } else {
          const exerciseResult = await database.runAsync(
            'INSERT INTO exercises (name, category) VALUES (?, ?);',
            exercise.name,
            'default' // You might want to define categories for default exercises
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
              'kg' // Default weight unit
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