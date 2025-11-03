import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Workout, WorkoutLog, storage } from '../services/storage';

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
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const baseMarkings = history.reduce((acc, log) => {
      const dateString = log.completedAt.split('T')[0];
      acc[dateString] = { ...acc[dateString], marked: true, dotColor: '#007AFF' };
      return acc;
    }, {} as MarkedDates);

    if (selectedDate) {
      baseMarkings[selectedDate] = {
        ...baseMarkings[selectedDate],
        selected: true,
        selectedColor: '#007AFF',
      };
    }
    setMarkedDates(baseMarkings);
  }, [history, selectedDate]);

  const loadData = async () => {
    try {
      const historyData = await storage.getWorkoutHistory();
      const workoutsData = await storage.getWorkouts();
      setHistory(historyData);
      setWorkouts(workoutsData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const handleLogWorkout = async (workout: Workout) => {
    if (!selectedDate) return;

    // Corrige o bug de fuso horário
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
    const localDateTimeString = `${selectedDate}T${timeString}`;
    const completedAt = new Date(localDateTimeString);

    await storage.saveWorkoutToHistory(workout, completedAt.toISOString());

    setModalVisible(false);
    loadData(); // Recarrega os dados para atualizar o calendário
  };

  const handleDeleteLog = (logId: string) => {
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
              loadData(); // Recarrega os dados para atualizar a UI
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o registro.');
            }
          },
        },
      ]
    );
  };

  const workoutsForSelectedDate = selectedDate
    ? history.filter(log => log.completedAt.startsWith(selectedDate))
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Treinos</Text>
      </View>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{ todayTextColor: '#007AFF', arrowColor: '#007AFF' }}
      />
      <ScrollView style={styles.detailsContainer}>
        {selectedDate && workoutsForSelectedDate.length > 0 ? (
          workoutsForSelectedDate.map(log => (
            <View key={log.logId} style={styles.logCard}>
              <View style={styles.logCardHeader}>
                <Text style={styles.logTitle}>{log.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteLog(log.logId)}>
                  <Text style={styles.deleteLogText}>Excluir</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.logDate}>
                {new Date(log.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {log.exercises.map(ex => (
                <View key={ex.id} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  {ex.sets.map(set => (
                    <Text key={set.number} style={styles.setText}>
                      Série {set.number}: {set.reps} reps com {set.weight}{set.weightUnit}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))
        ) : selectedDate ? (
          <View style={styles.noWorkoutContainer}>
            <Text style={styles.noWorkoutText}>Nenhum treino registrado neste dia.</Text>
            <TouchableOpacity style={styles.logButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.logButtonText}>Registrar Treino Realizado</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noWorkoutText}>Selecione uma data para ver os treinos.</Text>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Treino</Text>
            <FlatList
              data={workouts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.workoutOption} onPress={() => handleLogWorkout(item)}>
                  <Text style={styles.workoutOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold' },
  detailsContainer: { flex: 1, padding: 20 },
  logCard: { backgroundColor: '#f8f8f8', borderRadius: 8, padding: 15, marginBottom: 15 },
  logCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  logTitle: { fontSize: 18, fontWeight: '600', flex: 1 },
  deleteLogText: { fontSize: 14, color: '#FF3B30', fontWeight: '500' },
  logDate: { fontSize: 14, color: '#666', marginBottom: 10 },
  exerciseContainer: { marginTop: 5 },
  exerciseName: { fontSize: 16, fontWeight: '500' },
  setText: { color: '#333', marginLeft: 10 },
  noWorkoutContainer: { alignItems: 'center' },
  noWorkoutText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
  logButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 16 },
  logButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '70%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  workoutOption: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  workoutOptionText: { fontSize: 18 },
  cancelButton: { marginTop: 15, padding: 10, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, color: '#FF3B30' },
});
