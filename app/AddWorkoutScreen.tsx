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
import { CategorySelector } from '../src/components/CategorySelector';
import { ExerciseImage } from '../src/components/ExerciseImage';
import { ExerciseSelector } from '../src/components/ExerciseSelector';
import { SetRow } from '../src/components/SetRow';
import { CatalogExercise } from '../src/constants/exerciseCatalog';
import { getCategoryLabel } from '../src/constants/workoutTypes';
import { getDb } from '../src/services/database';
import { storage, Workout } from '../src/services/storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { toast } from '../src/utils/toast';
import { useTheme } from '../src/contexts/ThemeContext';
// Adicionado para forçar re-bundle

export default function AddWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
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

  const [workoutName, setWorkoutName] = useState('');
  const [category, setCategory] = useState<any>('other');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutId, setWorkoutId] = useState<number | null>(null);

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const updateExercise = (exerciseId: number, field: keyof Exercise | 'sets', value: any) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    );
  };

  const handleConfirmSelection = (selectedExercises: CatalogExercise[]) => {
    const newExercises: Exercise[] = selectedExercises.map((ex) => ({
      id: (Date.now() + Math.random()).toString(), // Unique ID for new exercise
      name: ex.name,
      sets: [{ id: Date.now() + Math.random(), number: 1, reps: '10', weight: '0', weightUnit: 'kg', isCompleted: false }],
      imageUri: ex.imageUri,
      notes: '',
    }));
    setExercises((prev) => [...prev, ...newExercises]);
    setShowExerciseSelector(false);
  };

  const initialWorkoutData = params.workout ? JSON.parse(params.workout as string) : {};
  useEffect(() => {
    if (params.workout) {
      const workoutToEdit: Workout = initialWorkoutData;
      setWorkoutName(workoutToEdit.name);
      setCategory(workoutToEdit.category);
      setExercises(workoutToEdit.exercises);
      setWorkoutId(workoutToEdit.id);
    }
  }, [params.workout]);

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      toast.error('Digite o nome do treino');
      return;
    }

    if (exercises.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    // Validar que todos os exercícios têm valores válidos
    for (const exercise of exercises) {
      if (!exercise.sets || exercise.sets.length === 0) {
        toast.error(`O exercício "${exercise.name}" precisa ter pelo menos uma série`);
        return;
      }

      for (const set of exercise.sets) {
        const reps = parseInt(set.reps, 10);
        const weight = parseFloat(set.weight);

        if (isNaN(reps) || reps <= 0) {
          toast.error(`O exercício "${exercise.name}" tem séries com repetições inválidas`);
          return;
        }

        if (isNaN(weight) || weight < 0) {
          toast.error(`O exercício "${exercise.name}" tem séries com peso inválido`);
          return;
        }
      }
    }

    const workoutData = {
      name: workoutName.trim(),
      category,
      exercises,
    };

    if (workoutId) {
      await storage.updateWorkout({ ...workoutData, id: workoutId });
      toast.success(`Treino "${workoutName}" atualizado!`);
    } else {
      await storage.saveWorkout(workoutData);
      toast.success(`Treino "${workoutName}" salvo com sucesso!`);
    }

    router.push('/');
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.mainContainer, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.backButton, { color: colors.primary }]}>Voltar</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Novo Treino</Text>
            <View style={{ width: 50 }} />
          </View>


          <Text style={[styles.label, { color: colors.textSecondary }]}>Nome do Treino</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
            value={initialWorkoutData.name || workoutName}
            onChangeText={setWorkoutName}
            placeholder="Ex: Treino A - Peito e Tríceps"
            placeholderTextColor={colors.placeholder}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (exercises.length === 0) {
                setShowExerciseSelector(true);
              } else {
                inputRefs[`${exercises[0].id}-name`]?.current?.focus();
              }
            }}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria</Text>
          <TouchableOpacity
            style={[styles.categorySelector, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => setShowCategorySelector(true)}
          >
            <Text style={[styles.categorySelectorText, { color: colors.text }]}>
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

          <Text style={[styles.subtitle, { color: colors.text }]}>Exercícios</Text>

          {exercises.map((exercise, index) => {
            const exerciseNumber = `Exercício ${index + 1}`;
            return (
              <View key={exercise.id} style={[styles.exerciseContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.exerciseHeader}>
                  <Text style={[styles.exerciseTitle, { color: colors.text }]}>{exerciseNumber}</Text>
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: colors.error }]}
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
                  style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                  value={exercise.name}
                  onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
                  placeholder="Nome do exercício"
                  placeholderTextColor={colors.placeholder}
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextInput(exercise.id, 'name')}
                  blurOnSubmit={false}
                />
                <View style={styles.setsContainer}>
                  <Text style={[styles.setsTitle, { color: colors.text }]}>Séries</Text>
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
                      isEditable={false}
                    />
                  ))}
                  <TouchableOpacity
                    style={[styles.addSetButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => {
                      const newSet: Set = { id: Date.now() + Math.random(), number: exercise.sets.length + 1, reps: '10', weight: '10', weightUnit: 'kg', isCompleted: false };
                      updateExercise(exercise.id, 'sets', [...exercise.sets, newSet]);
                    }}
                  >
                    <Text style={[styles.addSetButtonText, { color: colors.primary }]}>+ Adicionar Série</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowExerciseSelector(true)}
          >
            <Text style={styles.addButtonText}>+ Adicionar Exercício</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={[styles.bottomContainer, { borderTopColor: colors.borderLight, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.success }]}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButton: {
    fontSize: 16,
  },
  setsContainer: {
    marginTop: 10,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  addSetButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addSetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  exerciseContainer: {
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
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
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
  },
  saveButton: {
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  categorySelectorText: {
    fontSize: 16,
  },
});