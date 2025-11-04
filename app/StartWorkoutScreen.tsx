import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Exercise, Set, Workout, storage } from '../src/services/storage';
import { SetRow } from '../src/components/SetRow';
import { ExerciseImage } from '../src/components/ExerciseImage';

import { useNavigation } from 'expo-router';

export default function StartWorkoutScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const initialWorkout: Workout = JSON.parse(params.workout as string);

  const [currentWorkout, setCurrentWorkout] = useState<Workout>(initialWorkout);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [navigation, isWorkoutFinished]);

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const handleUpdateSet = (exerciseId: string, updatedSet: Set) => {
    const newWorkout = { ...currentWorkout };
    const exercise = newWorkout.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      const setIndex = exercise.sets.findIndex(s => s.id === updatedSet.id);
      if (setIndex !== -1) {
        exercise.sets[setIndex] = updatedSet;
        setCurrentWorkout(newWorkout);
      }
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const areAllSetsCompleted = (exercise: Exercise) => {
    return exercise.sets.every(set => set.isCompleted);
  };

  const areAllExercisesCompleted = () => {
    return currentWorkout.exercises.every(exercise => areAllSetsCompleted(exercise));
  };

  const handleFinishWorkout = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);

    if (!areAllExercisesCompleted()) {
      Alert.alert(
        'Treino Incompleto',
        'Nem todos os exercícios foram marcados como concluídos. Deseja finalizar o treino mesmo assim?',
        [
          { text: "Cancelar", style: 'cancel' },
          {
            text: 'Finalizar Mesmo Assim',
            onPress: async () => {
              await storage.saveWorkoutToHistory(currentWorkout, new Date().toISOString(), duration);
              await storage.updateWorkout(currentWorkout); // Atualiza o treino original
              setIsWorkoutFinished(true);
              router.replace({
                pathname: '/WorkoutSummaryScreen',
                params: { workoutName: currentWorkout.name, workoutDuration: duration },
              });
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Finalizar Treino',
      'Deseja finalizar o treino?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Finalizar',
          onPress: async () => {
            await storage.saveWorkoutToHistory(currentWorkout, new Date().toISOString(), duration);
            await storage.updateWorkout(currentWorkout); // Atualiza o treino original
            setIsWorkoutFinished(true);
            router.replace({
              pathname: '/WorkoutSummaryScreen',
              params: { workoutName: currentWorkout.name, workoutDuration: duration },
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const currentExercise = currentWorkout.exercises[currentExerciseIndex];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.mainContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{currentWorkout.name}</Text>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>
        <ScrollView style={styles.content}>
          <View key={currentExercise.id} style={styles.exerciseContainer}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>{currentExercise.name}</Text>
            </View>
            {currentExercise.imageUri && <ExerciseImage imageUri={currentExercise.imageUri} imageStyle={styles.smallExerciseImage} />}
            <View style={styles.setsContainer}>
              {currentExercise.sets.map((set, setIndex) => (
                <SetRow
                  key={set.id}
                  set={set}
                  onUpdate={(updatedSet) => handleUpdateSet(currentExercise.id, updatedSet)}
                  isEditable={true}
                  showDelete={false} // Não permitir deletar sets durante o treino
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.navButton, currentExerciseIndex === 0 && styles.disabledButton]}
            onPress={handlePrevExercise} 
            disabled={currentExerciseIndex === 0}
          >
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
          {currentExerciseIndex === currentWorkout.exercises.length - 1 ? (
            <TouchableOpacity 
              style={[styles.finishButton, areAllExercisesCompleted() ? styles.finishButtonReady : styles.finishButtonDisabled]}
              onPress={handleFinishWorkout}
            >
              <Text style={styles.finishButtonText}>Finalizar Treino</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.navButton, !areAllSetsCompleted(currentExercise) && styles.navButtonNotReady]}
              onPress={handleNextExercise}
            >
              <Text style={styles.navButtonText}>Próximo</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  timer: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  smallExerciseImage: {
    height: 150, // Altura reduzida para a tela de execução do treino
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  setsContainer: {},
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  setText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    width: 60,
  },
  checkButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  checkButtonCompleted: {
    backgroundColor: '#34C759',
  },
  checkText: {
    color: '#000',
  },
  checkTextCompleted: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonNotReady: {
    backgroundColor: '#ccc',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  finishButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButtonReady: {
    backgroundColor: '#34C759',
  },
  finishButtonDisabled: {
    backgroundColor: '#ccc',
  },
});