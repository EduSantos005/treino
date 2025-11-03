import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CatalogExercise, exerciseCatalog } from '../constants/exerciseCatalog';
import { MuscleGroup, muscleGroupLabels } from '../constants/exerciseCategories';
import { storage } from '../services/storage';

type ExerciseSelectorProps = {
  visible: boolean;
  onClose: () => void;
  onConfirmSelection: (exercises: CatalogExercise[]) => void;
};

export function ExerciseSelector({ visible, onClose, onConfirmSelection }: ExerciseSelectorProps) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<CatalogExercise[]>([]);
  const [allExercises, setAllExercises] = useState<CatalogExercise[]>([]);

  useEffect(() => {
    if (visible) {
      const loadAllExercises = async () => {
        const customExercises = await storage.getCustomExercises();
        const combined = [...exerciseCatalog, ...customExercises].sort((a, b) => a.name.localeCompare(b.name));
        setAllExercises(combined);
      };
      loadAllExercises();
    }
  }, [visible]);

  const handleToggleExercise = (exercise: CatalogExercise) => {
    setSelectedExercises(prev =>
      prev.find(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const filteredExercises = allExercises.filter(ex => {
    const matchesMuscleGroup = selectedMuscleGroup
      ? ex.muscleGroups.includes(selectedMuscleGroup)
      : true;
    const matchesSearchTerm = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMuscleGroup && matchesSearchTerm;
  });

  const renderExerciseItem = ({ item }: { item: CatalogExercise }) => {
    const isSelected = selectedExercises.some(e => e.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.exerciseItem, isSelected && styles.exerciseItemSelected]}
        onPress={() => handleToggleExercise(item)}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={styles.exerciseImage}
        />
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.muscleGroupTags}>
            {item.muscleGroups.map(group => (
              <View key={group} style={styles.muscleGroupTag}>
                <Text style={styles.muscleGroupText}>
                  {muscleGroupLabels[group]}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {isSelected && <View style={styles.selectionIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecionar Exercício</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchAndFilterContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                !selectedMuscleGroup && styles.filterButtonSelected
              ]}
              onPress={() => setSelectedMuscleGroup(null)}
            >
              <Text style={[
                styles.filterButtonText,
                !selectedMuscleGroup && styles.filterButtonTextSelected
              ]}>
                Todos
              </Text>
            </TouchableOpacity>
            {Object.entries(muscleGroupLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterButton,
                  selectedMuscleGroup === key && styles.filterButtonSelected
                ]}
                onPress={() => setSelectedMuscleGroup(key as MuscleGroup)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedMuscleGroup === key && styles.filterButtonTextSelected
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.exerciseList}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              onConfirmSelection(selectedExercises);
              setSelectedExercises([]); // Limpa a seleção para a próxima vez
              onClose();
            }}
          >
            <Text style={styles.confirmButtonText}>
              Adicionar Selecionados ({selectedExercises.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40, // Adicionado para descer o conteúdo
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  searchAndFilterContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
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
  filterButtonText: {
    color: '#666',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  exerciseList: {
    padding: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseItemSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  muscleGroupTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleGroupTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  muscleGroupText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});