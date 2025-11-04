import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySelector } from '../components/CategorySelector';
import { ExerciseImage } from '../components/ExerciseImage';
import { ExerciseSelector } from '../components/ExerciseSelector';
import { SetRow } from '../components/SetRow';
import { CatalogExercise } from '../constants/exerciseCatalog';
import { getCategoryLabel } from '../constants/workoutTypes';
import { getDb } from '../services/database';
import { storage, Workout } from '../services/storage';
import { RootStackParamList } from '../types/navigation';

// Define the Exercise and Set types based on the database schema
type Set = { number: number; reps: number; weight: number; weightUnit?: string };
type Exercise = {
  id: number; // ID do banco de dados
  name: string;
  sets: Set[];
  imageUri?: string;
  notes?: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddWorkout'>;
type RouteProps = {
  params?: {
    workout?: any; // Adjust this type based on your workout structure
  };
};

export default function AddWorkoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const [inputRefs] = useState<{ [key: string]: React.RefObject<TextInput | null> }>({});

  const getInputRef = (exerciseId: string, field: string) => {
    const key = `${exerciseId}-${field}`;
    if (!inputRefs[key]) {
      inputRefs[key] = React.createRef<TextInput>();
    }
    return inputRefs[key];
  };

  const focusNextInput = (exerciseId: string, currentField: string) => {
    const fields = ['name', 'sets', 'reps', 'weight'];
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      const nextRef = inputRefs[`${exerciseId}-${nextField}`];
      nextRef?.current?.focus();
    }
  };

  useEffect(() => {
    if (route.params?.workout) {
      const workoutToEdit: Workout = route.params.workout;
      setWorkoutName(workoutToEdit.name);
      setCategory(workoutToEdit.category);
      setExercises(workoutToEdit.exercises);
    }
  }, [route.params?.workout]);

  const [workoutName, setWorkoutName] = useState('');
  const [category, setCategory] = useState<any>('other');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleConfirmSelection = (selectedCatalogExercises: CatalogExercise[]) => {
    const newExercises: Exercise[] = selectedCatalogExercises.map(catalogExercise => ({
      id: Date.now() + Math.random(), // Gerar um ID numérico temporário para a UI
      name: catalogExercise.name,
      sets: Array.from({ length: catalogExercise.defaultSets || 1 }, (_, i) => ({ number: i + 1, reps: 10, weight: 10, weightUnit: 'kg' })),
      imageUri: catalogExercise.imageUri,
      notes: catalogExercise.description
    }));
    setExercises(current => [...current, ...newExercises]);
  };

  const addExercise = () => {
    setShowExerciseSelector(true);
  };

  const updateExercise = (id: number, field: keyof Exercise, value: any) => {
    setExercises(current =>
      current.map(exercise =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'ios') {
      Alert.alert(title, message);
    } else {
      setTimeout(() => {
        Alert.alert(title, message);
      }, 100);
    }
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      showAlert('Atenção', 'Digite o nome do treino');
      return;
    }

    if (exercises.length === 0) {
      showAlert('Atenção', 'Adicione pelo menos um exercício');
      return;
    }

    const db = getDb();
    await db.withTransactionAsync(async () => {
      const workoutResult = await db.runAsync('INSERT INTO workouts (name, date, type) VALUES (?, ?, ?);', workoutName, new Date().toISOString(), category);
      const workoutId = workoutResult.lastInsertRowId;

      for (const exercise of exercises) {
        let exerciseId: number | undefined;
        const existingExercise = await db.getFirstAsync<{ id: number }>(
          'SELECT id FROM exercises WHERE name = ?;',
          exercise.name
        );

        if (existingExercise) {
          exerciseId = existingExercise.id;
          await db.runAsync(
            'UPDATE exercises SET image_uri = ? WHERE id = ?;',
            exercise.imageUri || null,
            exerciseId
          );
        } else {
          const exerciseResult = await db.runAsync(
            'INSERT INTO exercises (name, category, image_uri) VALUES (?, ?, ?);',
            exercise.name,
            'general', // Ou use uma categoria real se disponível
            exercise.imageUri || null
          );
          exerciseId = exerciseResult.lastInsertRowId;
        }

        if (exerciseId) {
          for (const set of exercise.sets) {
            await db.runAsync('INSERT INTO sets (workout_id, exercise_id, reps, weight, weight_unit) VALUES (?, ?, ?, ?, ?);', workoutId, exerciseId, set.reps, set.weight, set.weightUnit || 'kg');
          }
        }
      }
    });

    showAlert('Sucesso!', `Treino "${workoutName}" foi salvo com ${exercises.length} exercício(s)`);
    // Navegar para a HomeScreen e depois para StartWorkoutScreen com o ID do treino recém-criado
    navigation.navigate('Home');
    // TODO: Passar o ID do treino para StartWorkoutScreen para que ele possa ser carregado do banco de dados
    // Isso requer uma refatoração em StartWorkoutScreen para carregar o treino por ID
    // Por enquanto, apenas voltamos para a Home
    // navigation.navigate('StartWorkout', { workoutId: workoutId });
  };


  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <KeyboardAvoidingView 
        style={styles.mainContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Novo Treino</Text>
          
          <Text style={styles.label}>Nome do Treino</Text>
          <TextInput
            style={styles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Ex: Treino A - Peito e Tríceps"
            returnKeyType="next"
            onSubmitEditing={() => {
              if (exercises.length === 0) {
                addExercise();
              } else {
                inputRefs[`${exercises[0].id}-name`]?.current?.focus();
              }
            }}
          />

          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategorySelector(true)}
          >
            <Text style={styles.categorySelectorText}>
              {getCategoryLabel(category)}
            </Text>
          </TouchableOpacity>

          <CategorySelector
            visible={showCategorySelector}
            onClose={() => setShowCategorySelector(false)}
            onSelect={setCategory}
            selectedCategory={category}
          />

          <ExerciseSelector
            visible={showExerciseSelector}
            onClose={() => setShowExerciseSelector(false)}
            onConfirmSelection={handleConfirmSelection}
          />

          <Text style={styles.subtitle}>Exercícios</Text>
          
          {exercises.map((exercise, index) => {
            const exerciseNumber = `Exercício ${index + 1}`;
            return (
              <View key={exercise.id} style={styles.exerciseContainer}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseTitle}>{exerciseNumber}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      setExercises(exercises.filter(e => e.id !== exercise.id));
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remover</Text>
                  </TouchableOpacity>
                </View>

                <ExerciseImage
                  imageUri={exercise.imageUri}
                  onImageSelected={(uri) => 
                    updateExercise(exercise.id, 'imageUri', uri)
                  }
                />
                
                <TextInput
                  ref={getInputRef(exercise.id, 'name')}
                  style={styles.input}
                  value={exercise.name}
                  onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
                  placeholder="Nome do exercício"
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextInput(exercise.id, 'name')}
                  blurOnSubmit={false}
                />
                <View style={styles.setsContainer}>
                  <Text style={styles.setsTitle}>Séries</Text>
                  {exercise.sets.map((set, setIndex) => (
                    <SetRow
                      key={`set-${exercise.id}-${setIndex}`}
                      set={set}
                      onUpdate={(updatedSet) => {
                        const updatedSets = [...exercise.sets];
                        updatedSets[setIndex] = updatedSet;
                        updateExercise(exercise.id, 'sets', updatedSets);
                      }}
                      onDelete={() => {
                        if (exercise.sets.length > 1) {
                          const updatedSets = exercise.sets.filter((_, idx) => idx !== setIndex);
                          // Atualiza os números das séries
                          updatedSets.forEach((s, idx) => {
                            s.number = idx + 1;
                          });
                          updateExercise(exercise.id, 'sets', updatedSets);
                        } else {
                          Alert.alert(
                            'Atenção',
                            'O exercício deve ter pelo menos uma série'
                          );
                        }
                      }}
                      showDelete={exercise.sets.length > 1}
                    />
                  ))}
                  <TouchableOpacity
                    style={styles.addSetButton}
                    onPress={() => {
                      const newSet: Set = { number: exercise.sets.length + 1, reps: 10, weight: 10, weightUnit: 'kg' };
                      updateExercise(exercise.id, 'sets', [...exercise.sets, newSet]);
                    }}
                  >
                    <Text style={styles.addSetButtonText}>+ Adicionar Série</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addExercise}
          >
            <Text style={styles.addButtonText}>+ Adicionar Exercício</Text>
          </TouchableOpacity>
          
          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveWorkout}
            activeOpacity={0.5}
          >
            <Text style={styles.saveButtonText}>Salvar Treino</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  setsContainer: {
    marginTop: 10,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  addSetButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addSetButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  exerciseContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  categorySelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  categorySelectorText: {
    fontSize: 16,
    color: '#333',
  },
});