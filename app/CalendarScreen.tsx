import { useFocusEffect } from 'expo-router';
import { getCategoryLabel } from '../src/constants/workoutTypes';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal,ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDb } from '../src/services/database';
import { storage, WorkoutLog, Workout } from '../src/services/storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';

// Define types based on database schema
type Set = { id: number; reps: number; weight: number };
type Exercise = { id: number; name: string; category: string; sets: Set[] };

// Configuração de localidade para o calendário
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseMarkings = history.reduce((acc, log) => {
      const localDate = new Date(log.completedAt);
      const year = localDate.getFullYear();
      const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
      const day = localDate.getDate().toString().padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;

      acc[localDateString] = { ...acc[localDateString], marked: true, dotColor: colors.primary };
      return acc;
    }, {} as MarkedDates);

    if (selectedDate) {
      baseMarkings[selectedDate] = {
        ...baseMarkings[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };
    }
    setMarkedDates(baseMarkings);
  }, [history, selectedDate, colors]);

  const loadData = async () => {
    setLoading(true);
    try {
      const db = getDb();
      // Fetch all available workouts with their exercises and sets
      const rawWorkouts = await db.getAllAsync<any>(
        `SELECT
          w.id as workout_id,
          w.name as workout_name,
          w.date,
          w.category as workout_category, -- Corrigido de w.type
          e.id as exercise_id,
          e.name as exercise_name,
          e.category as exercise_category,
          s.id as set_id,
          s.reps,
          s.weight
        FROM workouts w
        LEFT JOIN sets s ON w.id = s.workout_id
        LEFT JOIN exercises e ON s.exercise_id = e.id
        ORDER BY w.id, e.id, s.id;`
      );

      const workoutsMap = new Map<string, Workout>();
      rawWorkouts.forEach((row: any) => {
        if (!row.workout_id) return;

        let workout = workoutsMap.get(row.workout_id.toString());
        if (!workout) {
          workout = {
            id: row.workout_id.toString(),
            date: row.date,
            name: row.workout_name,
            exercises: [],
            category: row.workout_category,
            createdAt: row.date,
            updatedAt: row.date,
          };
          workoutsMap.set(row.workout_id.toString(), workout);
        }

        if (row.exercise_id) {
          let exercise = workout.exercises.find(ex => ex.id === row.exercise_id.toString());
          if (!exercise) {
            exercise = {
              id: row.exercise_id.toString(),
              name: row.exercise_name,
              category: row.exercise_category,
              sets: [],
            };
            workout.exercises.push(exercise);
          }

          if (row.set_id) {
            exercise.sets.push({
              id: row.set_id,
              reps: row.reps.toString(),
              weight: row.weight.toString(),
              number: exercise.sets.length + 1,
              weightUnit: 'kg' // Assumindo kg como padrão
            });
          }
        }
      });
      setWorkouts(Array.from(workoutsMap.values()));

      // Fetch workout history logs using the storage function
      const historyData = await storage.getWorkoutHistory();
      setHistory(historyData);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do histórico.');
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const handleLogWorkout = async (workout: Workout) => {
    if (!selectedDate) return;

    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const localDateTimeString = `${selectedDate}T${timeString}`;
    const completedAt = new Date(localDateTimeString);

    const db = getDb();
    await db.runAsync(
      'INSERT INTO workout_logs (workout_id, completed_at, workout_details) VALUES (?, ?, ?);',
      parseInt(workout.id, 10),
      completedAt.toISOString(),
      JSON.stringify(workout.exercises) // Store only exercises as JSON
    );

    setModalVisible(false);
  };

  const handleDeleteLog = async (logId: string) => {
    Alert.alert(
      'Excluir Registro',
      'Tem certeza que deseja excluir este registro de treino? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.deleteWorkoutFromHistory(logId);
              loadData();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o registro.');
              console.error('Error deleting log:', error);
            }
          },
        },
      ]
    );
  };

  const workoutsForSelectedDate = selectedDate
    ? history.filter(log => {
        const localDate = new Date(log.completedAt);
        const year = localDate.getFullYear();
        const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
        const day = localDate.getDate().toString().padStart(2, '0');
        const localDateString = `${year}-${month}-${day}`;
        return localDateString === selectedDate;
      })
    : [];

  const formatDuration = (seconds: number) => {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Histórico de Treinos</Text>
        <View style={{ width: 50 }} />
      </View>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.text,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
        }}
      />
      <ScrollView style={styles.detailsContainer}>
        {selectedDate && workoutsForSelectedDate.length > 0 ? (
          workoutsForSelectedDate.map(log => (
            <View key={log.logId} style={[styles.logCard, { backgroundColor: colors.background }]}>
              <View style={styles.logCardHeader}>
                <Text style={[styles.logTitle, { color: colors.text }]}>{log.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteLog(log.logId)}>
                  <Text style={[styles.deleteLogText, { color: colors.error }]}>Excluir</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.logDate, { color: colors.textSecondary }]}>
                {new Date(log.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {log.duration ? ` - ${formatDuration(log.duration)}` : ''}
              </Text>
              {(log.exercises || []).map(ex => (
                <View key={ex.id} style={[styles.exerciseContainer, { borderLeftColor: colors.primary }]}>
                  <Text style={[styles.exerciseName, { color: colors.text }]}>{ex.name}</Text>
                  {(ex.sets || []).map(set => (
                    <Text key={set.id} style={[styles.setText, { color: colors.textSecondary }]}>
                      Série {set.reps} reps com {set.weight} {set.weightUnit}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))
        ) : selectedDate ? (
          <View style={styles.noWorkoutContainer}>
            <Text style={[styles.noWorkoutText, { color: colors.textSecondary }]}>Nenhum treino registrado neste dia.</Text>
            <TouchableOpacity style={[styles.logButton, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
              <Text style={styles.logButtonText}>Registrar Treino Realizado</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.noWorkoutText, { color: colors.textSecondary }]}>Selecione uma data para ver os treinos.</Text>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Registrar Treino</Text>
            <FlatList
              data={workouts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.workoutOption, { borderBottomColor: colors.borderLight }]} onPress={() => handleLogWorkout(item)}>
                  <Text style={[styles.workoutOptionText, { color: colors.text }]}>
                    {item.name} ({getCategoryLabel(item.category)})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.error }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  logCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  logCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteLogText: {
    fontWeight: 'bold',
  },
  logDate: {
    fontSize: 14,
    marginBottom: 10,
  },
  exerciseContainer: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  setText: {
    fontSize: 14,
  },
  noWorkoutContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noWorkoutText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  logButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  workoutOption: {
    padding: 15,
    borderBottomWidth: 1,
  },
  workoutOptionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});