import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
// Adicionado para forçar re-bundle
import { SafeAreaView } from 'react-native-safe-area-context';

const WorkoutSummaryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const workoutName = params.workoutName as string;
  const workoutDuration = Number(params.workoutDuration);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Treino Concluído!</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.label}>Nome do Treino:</Text>
        <Text style={styles.value}>{workoutName}</Text>
        <Text style={styles.label}>Tempo de Treino:</Text>
        <Text style={styles.value}>{formatDuration(workoutDuration)}</Text>
      </View>
      <Button title="Voltar para o Início" onPress={() => router.replace('/')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default WorkoutSummaryScreen;
