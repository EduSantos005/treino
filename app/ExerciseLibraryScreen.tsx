import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CatalogExercise, exerciseCatalog } from '../src/constants/exerciseCatalog';
import { MuscleGroup, muscleGroupLabels } from '../src/constants/exerciseCategories';
import { storage } from '../src/services/storage';
import { useRouter } from 'expo-router';

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const [allExercises, setAllExercises] = useState<CatalogExercise[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);

  const loadExercises = async () => {
    try {
      const customExercises = await storage.getCustomExercises();
      const combined = [...exerciseCatalog, ...customExercises].sort((a, b) => a.name.localeCompare(b.name));
      setAllExercises(combined);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os exercícios.');
    }
  };

  useFocusEffect(useCallback(() => { loadExercises(); }, []));

  const handleDelete = (exercise: CatalogExercise) => {
    Alert.alert(
      'Excluir Exercício',
      `Tem certeza que deseja excluir "${exercise.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            await storage.deleteCustomExercise(exercise.id);
            loadExercises();
          }
        }
      ]
    )
  }

  const filteredExercises = selectedMuscleGroup
    ? allExercises.filter(ex => ex.muscleGroups.includes(selectedMuscleGroup))
    : allExercises;

  const renderItem = ({ item }: { item: CatalogExercise }) => {
    const isCustom = item.id.startsWith('custom_');
    return (
      <View style={styles.exerciseCard}>
        <Image source={{ uri: item.imageUri }} style={styles.exerciseImage} />
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseMuscles}>{item.muscleGroups.map(g => muscleGroupLabels[g]).join(', ')}</Text>
          <Text style={styles.exerciseDescription} numberOfLines={2}>{item.description}</Text>
          {isCustom && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push({ pathname: "/EditExerciseScreen", params: { exerciseId: item.id } })}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Exercícios</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.filterWrapper}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, !selectedMuscleGroup && styles.filterButtonSelected]}
            onPress={() => setSelectedMuscleGroup(null)}
          >
            <Text style={[styles.filterButtonText, !selectedMuscleGroup && styles.filterButtonTextSelected]}>
              Todos
            </Text>
          </TouchableOpacity>
          {Object.entries(muscleGroupLabels).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterButton, selectedMuscleGroup === key && styles.filterButtonSelected]}
              onPress={() => setSelectedMuscleGroup(key as MuscleGroup)}
            >
              <Text style={[styles.filterButtonText, selectedMuscleGroup === key && styles.filterButtonTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/CreateExerciseScreen')}
        >
          <Text style={styles.addButtonText}>+ Criar Novo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 10, 
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButton: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 50, 
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  filterWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    margin: 4,
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: { color: '#666' },
  filterButtonTextSelected: { color: '#fff' },
  list: { padding: 20 },
  exerciseCard: { flexDirection: 'row', backgroundColor: '#f8f8f8', borderRadius: 8, padding: 15, marginBottom: 15, alignItems: 'flex-start' },
  exerciseImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  exerciseMuscles: { color: '#007AFF', marginBottom: 8, fontStyle: 'italic' },
  exerciseDescription: { color: '#666', marginBottom: 10 },
  actionsContainer: { flexDirection: 'row', marginTop: 5 },
  actionButton: { marginRight: 15 },
  editButtonText: { color: '#007AFF', fontWeight: 'bold' },
  deleteButtonText: { color: '#FF3B30', fontWeight: 'bold' },
});
