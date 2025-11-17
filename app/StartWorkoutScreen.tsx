import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image, TextInput, BackHandler, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Exercise, Set, Workout, storage } from '../src/services/storage';
import { SetRow } from '../src/components/SetRow';
import { ExerciseImage } from '../src/components/ExerciseImage';
import { Timer } from '../src/components/Timer';
import { useTheme } from '../src/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

import { useNavigation } from 'expo-router';

export default function StartWorkoutScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { restTime: configuredRestTime, colors } = useTheme();
  const params = useLocalSearchParams();
  const initialWorkout: Workout = JSON.parse(params.workout as string);

  const [currentWorkout, setCurrentWorkout] = useState<Workout>(initialWorkout);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [navigation, isWorkoutFinished]);

  const handleBackPress = useCallback(() => {
    Alert.alert(
      'Sair do Treino',
      'Se você voltar agora, o progresso do treino atual será perdido. Deseja realmente sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            setIsWorkoutFinished(true);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  }, [router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isWorkoutFinished) {
        handleBackPress();
        return true; // Previne o comportamento padrão
      }
      return false; // Permite voltar se o treino já foi finalizado
    });

    return () => backHandler.remove();
  }, [isWorkoutFinished, handleBackPress]);

  const playRestCompleteNotification = async () => {
    try {
      // Vibração forte tripla para notificar claramente
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Aguarda um pouco e vibra novamente para chamar mais atenção
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 200);

      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 400);

      // Configura o áudio para tocar mesmo no modo silencioso
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Toca um som de notificação usando o sistema
      // Usamos um beep curto e agudo
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/buttons/sounds/beep-07a.mp3' },
        { shouldPlay: true, volume: 1.0 }
      );

      // Limpa o som após tocar
      setTimeout(async () => {
        try {
          await sound.unloadAsync();
        } catch (e) {
          console.log('Erro ao limpar som:', e);
        }
      }, 2000);
    } catch (error) {
      // Se falhar ao tocar som, apenas vibra
      console.log('Erro ao tocar notificação:', error);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 200);
      } catch (e) {
        console.log('Erro na vibração:', e);
      }
    }
  };

  const startRestTimer = useCallback(() => {
    setRestTimeRemaining(configuredRestTime);
    setIsResting(true);

    let timeLeft = configuredRestTime;
    restTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      setRestTimeRemaining(timeLeft);

      if (timeLeft <= 0) {
        if (restTimerRef.current) {
          clearInterval(restTimerRef.current);
          restTimerRef.current = null;
        }
        playRestCompleteNotification(); // Notifica o usuário

        // Mantém o modal aberto por 3 segundos após o término para o usuário ver a notificação
        setTimeout(() => {
          setIsResting(false);
          setRestTimeRemaining(null);
        }, 3000);
      }
    }, 1000);
  }, [configuredRestTime]);

  const skipRest = useCallback(() => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
    setIsResting(false);
    setRestTimeRemaining(null);
  }, []);

  useEffect(() => {
    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, []);

  const handleUpdateSet = useCallback((exerciseId: string, updatedSet: Set) => {
    const newWorkout = { ...currentWorkout };
    const exercise = newWorkout.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      const setIndex = exercise.sets.findIndex(s => s.id === updatedSet.id);
      if (setIndex !== -1) {
        const previouslyCompleted = exercise.sets[setIndex].isCompleted;
        exercise.sets[setIndex] = updatedSet;
        setCurrentWorkout(newWorkout);

        // Se a série foi marcada como concluída (e não estava antes), inicia timer de descanso
        if (updatedSet.isCompleted && !previouslyCompleted) {
          const isLastSetOfExercise = setIndex === exercise.sets.length - 1;
          const isLastExercise = currentExerciseIndex === currentWorkout.exercises.length - 1;

          // Só inicia o timer se não for a última série do último exercício
          if (!isLastSetOfExercise || !isLastExercise) {
            startRestTimer();
          }
        }
      }
    }
  }, [currentWorkout, currentExerciseIndex, startRestTimer]);

  const handleNextExercise = useCallback(() => {
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  }, [currentExerciseIndex, currentWorkout.exercises.length]);

  const handlePrevExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  }, [currentExerciseIndex]);

  const areAllSetsCompleted = useCallback((exercise: Exercise) => {
    return exercise.sets.every(set => set.isCompleted);
  }, []);

  const areAllExercisesCompleted = useCallback(() => {
    return currentWorkout.exercises.every(exercise => areAllSetsCompleted(exercise));
  }, [currentWorkout.exercises, areAllSetsCompleted]);

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.mainContainer, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={[styles.backButton, { color: colors.primary }]}>Voltar</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{currentWorkout.name}</Text>
          <Timer elapsedTime={elapsedTime} style={{ color: colors.primary }} />
        </View>
        <ScrollView style={styles.content}>
          <View key={currentExercise.id} style={[styles.exerciseContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.exerciseHeader}>
              <Text style={[styles.exerciseTitle, { color: colors.text }]}>{currentExercise.name}</Text>
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

        <View style={[styles.footer, { borderTopColor: colors.borderLight, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }, currentExerciseIndex === 0 && { backgroundColor: colors.disabled }]}
            onPress={handlePrevExercise}
            disabled={currentExerciseIndex === 0}
          >
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
          {currentExerciseIndex === currentWorkout.exercises.length - 1 ? (
            <TouchableOpacity
              style={[styles.finishButton, { backgroundColor: areAllExercisesCompleted() ? colors.success : colors.disabled }]}
              onPress={handleFinishWorkout}
            >
              <Text style={styles.finishButtonText}>Finalizar Treino</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: areAllSetsCompleted(currentExercise) ? colors.primary : colors.disabled }]}
              onPress={handleNextExercise}
            >
              <Text style={styles.navButtonText}>Próximo</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Rest Timer Modal */}
      <Modal
        visible={isResting}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.restModalOverlay}>
          <View style={[
            styles.restModalContent,
            { backgroundColor: colors.surface },
            restTimeRemaining !== null && restTimeRemaining <= 0 && { borderColor: colors.success, borderWidth: 3 }
          ]}>
            <Text style={[styles.restModalTitle, { color: colors.text }]}>
              {restTimeRemaining !== null && restTimeRemaining <= 0 ? '✓ Pronto!' : 'Descanse'}
            </Text>
            <Text style={[
              styles.restTimerText,
              { color: restTimeRemaining !== null && restTimeRemaining <= 0 ? colors.success : colors.primary }
            ]}>
              {restTimeRemaining !== null && restTimeRemaining >= 0 ? `${restTimeRemaining}s` : '0s'}
            </Text>
            {restTimeRemaining !== null && restTimeRemaining <= 0 && (
              <Text style={[styles.restCompleteMessage, { color: colors.success }]}>
                Descanso concluído! Pronto para próxima série.
              </Text>
            )}
            <TouchableOpacity
              style={[styles.skipRestButton, { backgroundColor: colors.primary }]}
              onPress={skipRest}
            >
              <Text style={styles.skipRestButtonText}>
                {restTimeRemaining !== null && restTimeRemaining <= 0 ? 'Continuar' : 'Pular Descanso'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  timer: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseContainer: {
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
  },
  navButton: {
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
  navButtonNotReady: {},
  disabledButton: {},
  finishButton: {
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
  finishButtonReady: {},
  finishButtonDisabled: {},
  restModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restModalContent: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    minWidth: 280,
  },
  restModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restTimerText: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restCompleteMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  skipRestButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipRestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});