import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseImage } from '../src/components/ExerciseImage';
import { CatalogExercise } from '../src/constants/exerciseCatalog';
import { MuscleGroup, muscleGroupLabels } from '../src/constants/exerciseCategories';
import { storage } from '../src/services/storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';

export default function EditExerciseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const exerciseId = params.exerciseId as string;

  const [exercise, setExercise] = useState<CatalogExercise | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([]);
  const [imageUri, setImageUri] = useState<string | undefined>();

  useEffect(() => {
    const loadExercise = async () => {
      const customExercises = await storage.getCustomExercises();
      const foundExercise = customExercises.find(ex => ex.id === exerciseId);
      if (foundExercise) {
        setExercise(foundExercise);
        setName(foundExercise.name);
        setDescription(foundExercise.description);
        setSelectedGroups(foundExercise.muscleGroups);
        setImageUri(foundExercise.imageUri);
      } else {
        Alert.alert('Erro', 'Exercício não encontrado.');
        router.back();
      }
    };
    loadExercise();
  }, [exerciseId]);

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedGroups(prev => 
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleSave = async () => {
    if (!exercise) return;

    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome do exercício é obrigatório.');
      return;
    }
    if (selectedGroups.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um grupo muscular.');
      return;
    }

    try {
      const updatedExercise: CatalogExercise = {
        ...exercise,
        name,
        description,
        muscleGroups: selectedGroups,
        imageUri: imageUri || 'https://via.placeholder.com/1000x1000.png?text=Exercicio',
      };
      await storage.updateCustomExercise(updatedExercise);
      Alert.alert('Sucesso!', 'Exercício atualizado.');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o exercício.');
    }
  };

  if (!exercise) {
    return null; // ou um ActivityIndicator
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Editar Exercício</Text>

          <ExerciseImage imageUri={imageUri} onImageSelected={setImageUri} />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Nome do Exercício</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Rosca Martelo"
            placeholderTextColor={colors.placeholder}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Descrição (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Alguma observação sobre o exercício"
            placeholderTextColor={colors.placeholder}
            multiline
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Grupos Musculares</Text>
          <View style={styles.muscleGroupContainer}>
            {Object.keys(muscleGroupLabels).map(key => {
              const group = key as MuscleGroup;
              const isSelected = selectedGroups.includes(group);
              return (
                <TouchableOpacity
                  key={group}
                  style={[styles.chip, { backgroundColor: colors.surfaceVariant }, isSelected && { backgroundColor: colors.primary }]}
                  onPress={() => toggleMuscleGroup(group)}
                >
                  <Text style={[styles.chipText, { color: colors.text }, isSelected && styles.chipTextSelected]}>
                    {muscleGroupLabels[group]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
        <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.success }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  muscleGroupContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  chip: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, margin: 4 },
  chipText: {},
  chipTextSelected: { color: '#fff' },
  footer: { padding: 20, borderTopWidth: 1 },
  saveButton: { padding: 15, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
