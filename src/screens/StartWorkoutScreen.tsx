import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseImage } from '../components/ExerciseImage';
import { SetRow } from '../components/SetRow';
import { Exercise, Set, Workout } from '../services/storage';
import { RootStackParamList } from '../types/navigation';

type RouteParams = {
  workout: Workout;
};

export default function StartWorkoutScreen() {
  const route = useRoute();
  const { workout } = route.params as RouteParams;
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exercises, setExercises] = useState(workout.exercises);
  const width = Dimensions.get('window').width;
  const carouselRef = React.useRef<any>(null);

  const updateSet = (exerciseIndex: number, setIndex: number, updatedSet: Set) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex] = updatedSet;
    setExercises(newExercises);
  };

  const isExerciseCompleted = (exercise: Exercise) => {
    return exercise.sets.every(set => set.isCompleted);
  };

  const isWorkoutCompleted = () => {
    return exercises.every(isExerciseCompleted);
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const finishWorkout = () => {
    if (isWorkoutCompleted()) {
      Alert.alert(
        'Parabéns! 🎉',
        'Você completou todos os exercícios do treino!',
        [{ 
          text: 'OK',
          onPress: () => navigation.navigate('Home')
        }]
      );
    } else {
      Alert.alert(
        'Atenção',
        'Ainda há exercícios não completados. Deseja finalizar mesmo assim?',
        [
          { text: 'Não', style: 'cancel' },
          { 
            text: 'Sim', 
            style: 'destructive',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }
  };

  const renderExercise = ({ item: exercise, index }: { item: Exercise; index: number }) => {
    const completed = isExerciseCompleted(exercise);

    return (
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
              onUpdate={(updatedSet) => updateSet(index, setIndex, updatedSet)}
              showDelete={false}
            />
          ))}
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, index === 0 && styles.navButtonDisabled]}
            onPress={() => {
              if (index > 0) {
                carouselRef.current?.scrollTo({ index: index - 1 });
              }
            }}
            disabled={index === 0}
          >
            <Text style={[styles.navButtonText, index === 0 && styles.navButtonTextDisabled]}>
              ← Voltar Exerc.
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.progressText}>
            {index + 1} de {exercises.length}
          </Text>
          
          <TouchableOpacity
            style={[styles.navButton, index === exercises.length - 1 && styles.navButtonDisabled]}
            onPress={() => {
              if (index < exercises.length - 1) {
                carouselRef.current?.scrollTo({ index: index + 1 });
              }
            }}
            disabled={index === exercises.length - 1}
          >
            <Text style={[styles.navButtonText, index === exercises.length - 1 && styles.navButtonTextDisabled]}>
              Próx. Exerc. →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
          <Text style={styles.finishButtonText}>Finalizar Treino</Text>
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
            onSnapToItem={(index) => setCurrentExercise(index)}
            renderItem={renderExercise}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
          />
        )}
      </View>
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
});