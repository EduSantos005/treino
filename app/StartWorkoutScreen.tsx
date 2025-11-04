import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Exercise, Set, Workout, storage } from '../src/services/storage';

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
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isWorkoutFinished) {
        return;
      }
      e.preventDefault();
      Alert.alert(
        'Descartar treino?',
        'Você tem certeza que quer descartar este treino? Todo o seu progresso será perdido.',
        [
          { text: "Não sair", style: 'cancel', onPress: () => {} },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      unsubscribe();
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

  const [completedSets, setCompletedSets] = useState<string[]>([]);

  const handleToggleSet = (setId: string) => {
    setCompletedSets(prev => 
      prev.includes(setId) ? prev.filter(id => id !== setId) : [...prev, setId]
    );
  };

  const isSetCompleted = (setId: string) => completedSets.includes(setId);

  const handleRepChange = (exerciseId: string, setId: string, reps: string) => {
    const newWorkout = { ...currentWorkout };
    const exercise = newWorkout.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      const set = exercise.sets.find(s => s.id === setId);
      if (set) {
        set.reps = reps;
        setCurrentWorkout(newWorkout);
      }
    }
  };

  const handleWeightChange = (exerciseId: string, setId: string, weight: string) => {
    const newWorkout = { ...currentWorkout };
    const exercise = newWorkout.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      const set = exercise.sets.find(s => s.id === setId);
      if (set) {
        set.weight = weight;
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
    return exercise.sets.every(set => isSetCompleted(set.id));
  };

  const handleFinishWorkout = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
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
            {currentExercise.imageUri && <Image source={{ uri: currentExercise.imageUri }} style={styles.exerciseImage} />}
            <View style={styles.setsContainer}>
              {currentExercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setText}>Série {set.number}</Text>
                  <TextInput
                    style={styles.input}
                    value={set.reps}
                    onChangeText={(text) => handleRepChange(currentExercise.id, set.id, text)}
                    keyboardType="numeric"
                    editable={!isSetCompleted(set.id)}
                  />
                  <TextInput
                    style={styles.input}
                    value={set.weight}
                    onChangeText={(text) => handleWeightChange(currentExercise.id, set.id, text)}
                    keyboardType="numeric"
                    editable={!isSetCompleted(set.id)}
                  />
                  <Text style={styles.setText}>{set.weightUnit}</Text>
                  <TouchableOpacity 
                    style={[styles.checkButton, isSetCompleted(set.id) && styles.checkButtonCompleted]}
                    onPress={() => handleToggleSet(set.id)}
                  >
                    <Text style={isSetCompleted(set.id) ? styles.checkTextCompleted : styles.checkText}>✓</Text>
                  </TouchableOpacity>
                </View>
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
            <TouchableOpacity style={styles.finishButton} onPress={handleFinishWorkout}>
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
});