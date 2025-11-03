import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseImage } from '../components/ExerciseImage';
import { SetRow } from '../components/SetRow';
import { Exercise, Set, Workout, storage } from '../services/storage';
import { RootStackParamList } from '../types/navigation';
import * as Haptics from 'expo-haptics';

type RouteParams = {
  workout: Workout;
};

const REST_TIME_SECONDS = 60;

export default function StartWorkoutScreen() {
  const route = useRoute();
  const { workout } = route.params as RouteParams;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState(workout.exercises);
  const width = Dimensions.get('window').width;
  const carouselRef = useRef<any>(null);
  const inputRefs = useRef<{ [key: string]: TextInput }>({});

  // Timer State
  const [isTimerVisible, setTimerVisible] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(REST_TIME_SECONDS);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setTimerSeconds(REST_TIME_SECONDS);
    setTimerVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => prev - 1);
    }, 1000);
  };

  useEffect(() => {
    if (timerSeconds === 0) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setTimerVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [timerSeconds]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const focusNextInput = (exerciseIndex: number, setIndex: number, currentField: 'reps' | 'weight') => {
    if (currentField === 'reps') {
      const nextRef = inputRefs.current[`${exerciseIndex}-${setIndex}-weight`];
      nextRef?.focus();
    }
  };

  const updateSet = (exerciseIndex: number, setIndex: number, updatedSet: Set) => {
    const newExercises = [...exercises];
    const oldSet = newExercises[exerciseIndex].sets[setIndex];
    newExercises[exerciseIndex].sets[setIndex] = updatedSet;
    setExercises(newExercises);

    // Se a série está sendo marcada como completa (e não desmarcada)
    if (updatedSet.isCompleted && !oldSet.isCompleted) {
      startTimer();
    }
  };

  const isExerciseCompleted = (exercise: Exercise) => {
    return exercise.sets.every(set => set.isCompleted);
  };

  const isWorkoutCompleted = () => {
    return exercises.every(isExerciseCompleted);
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const finishWorkout = () => {
    const completedWorkout: Workout = {
      ...workout,
      exercises: exercises,
    };

    const saveAndExit = async () => {
      try {
        await storage.updateWorkout(completedWorkout);
        await storage.saveWorkoutToHistory(completedWorkout);
        Alert.alert(
          'Treino Salvo!',
          'Seu progresso foi salvo com sucesso.',
          [{ 
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }]
        );
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar o treino.');
      }
    };

    if (isWorkoutCompleted()) {
      Alert.alert(
        'Parabéns! 🎉',
        'Você completou o treino. Deseja salvar seu progresso?',
        [
          { text: 'Não Salvar', style: 'cancel', onPress: () => navigation.navigate('Home') },
          { 
            text: 'Salvar e Sair', 
            onPress: saveAndExit
          }
        ]
      );
    } else {
      Alert.alert(
        'Encerrar Treino?',
        'Você ainda tem séries pendentes. O que deseja fazer?',
        [
          { 
            text: 'Salvar e Sair', 
            onPress: saveAndExit
          },
          { 
            text: 'Sair sem Salvar', 
            style: 'destructive', 
            onPress: () => navigation.navigate('Home') 
          },
          { text: 'Continuar Treino', style: 'cancel' },
        ]
      );
    }
  };

  const renderExercise = ({ item: exercise, index: exerciseIndex }: { item: Exercise; index: number }) => {
    const completed = isExerciseCompleted(exercise);

    return (
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={140}
      >
        <ScrollView 
          style={styles.exerciseCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.exerciseCardContent}
        >
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            {completed && <Text style={styles.completedBadge}>✓</Text>}
          </View>

          {exercise.imageUri && (
            <View style={styles.imageContainer}>
              <ExerciseImage
                imageUri={exercise.imageUri}
              />
            </View>
          )}

          <View style={styles.setsContainer}>
            {exercise.sets.map((set, setIndex) => (
              <SetRow
                key={set.number}
                set={set}
                onUpdate={(updatedSet) => updateSet(exerciseIndex, setIndex, updatedSet)}
                showDelete={false}
                repsRef={(ref) => inputRefs.current[`${exerciseIndex}-${setIndex}-reps`] = ref}
                weightRef={(ref) => inputRefs.current[`${exerciseIndex}-${setIndex}-weight`] = ref}
                onSubmitReps={() => focusNextInput(exerciseIndex, setIndex, 'reps')}
              />
            ))}
          </View>

          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, exerciseIndex === 0 && styles.navButtonDisabled]}
              onPress={() => {
                if (exerciseIndex > 0) {
                  carouselRef.current?.scrollTo({ index: exerciseIndex - 1 });
                }
              }}
              disabled={exerciseIndex === 0}
            >
              <Text style={[styles.navButtonText, exerciseIndex === 0 && styles.navButtonTextDisabled]}>
                ← Voltar Exerc.
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.progressText}>
              {exerciseIndex + 1} de {exercises.length}
            </Text>
            
            <TouchableOpacity
              style={[styles.navButton, exerciseIndex === exercises.length - 1 && styles.navButtonDisabled]}
              onPress={() => {
                if (exerciseIndex < exercises.length - 1) {
                  carouselRef.current?.scrollTo({ index: exerciseIndex + 1 });
                }
              }}
              disabled={exerciseIndex === exercises.length - 1}
            >
              <Text style={[styles.navButtonText, exerciseIndex === exercises.length - 1 && styles.navButtonTextDisabled]}>
                Próx. Exerc. →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.workoutTitle}>{workout.name}</Text>
        <TouchableOpacity
          style={[
            styles.finishButton,
            isWorkoutCompleted() ? styles.finishButtonCompleted : styles.finishButtonIncomplete
          ]}
          onPress={finishWorkout}
        >
          <Text style={styles.finishButtonText}>Encerrar treino</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carouselContainer}>
        {exercises.length > 0 && (
          <Carousel
            ref={carouselRef}
            loop={false}
            width={width}
            height={Dimensions.get('window').height - 140}
            data={exercises}
            defaultIndex={0}
            onSnapToItem={(index) => setCurrentExerciseIndex(index)}
            renderItem={renderExercise}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
          />
        )}
      </View>

      {isTimerVisible && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Descanso: {timerSeconds}s</Text>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
              setTimerVisible(false);
            }}
          >
            <Text style={styles.skipButtonText}>Pular</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0, // Remove o padding do topo
  },
  exerciseCardContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: -4, // Move o header um pouco mais para cima
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  finishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  finishButtonIncomplete: {
    backgroundColor: '#8E8E93',
  },
  finishButtonCompleted: {
    backgroundColor: '#34C759',
  },
  finishButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  exerciseCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedBadge: {
    fontSize: 20,
    color: '#34C759',
  },
  imageContainer: {
    aspectRatio: 1.5,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  setsContainer: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 12,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#8E8E93',
  },
  timerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#555',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  skipButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});