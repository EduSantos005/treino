import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseImage } from '../components/ExerciseImage';
import { MuscleGroup, muscleGroupLabels } from '../constants/exerciseCategories';
import { storage } from '../services/storage';

export default function CreateExerciseScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<MuscleGroup[]>([]);
  const [imageUri, setImageUri] = useState<string | undefined>();

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedGroups(prev => 
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome do exercício é obrigatório.');
      return;
    }
    if (selectedGroups.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um grupo muscular.');
      return;
    }

    try {
      await storage.saveCustomExercise({
        name,
        description,
        muscleGroups: selectedGroups,
        imageUri: imageUri || 'https://via.placeholder.com/1000x1000.png?text=Exercicio',
        defaultSets: 3,
        defaultReps: 10,
        instructions: [],
      });
      Alert.alert('Sucesso!', 'Exercício criado e salvo na sua biblioteca.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o exercício.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Criar Novo Exercício</Text>

          <ExerciseImage imageUri={imageUri} onImageSelected={setImageUri} />

          <Text style={styles.label}>Nome do Exercício</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Rosca Martelo"
          />

          <Text style={styles.label}>Descrição (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Alguma observação sobre o exercício"
            multiline
          />

          <Text style={styles.label}>Grupos Musculares</Text>
          <View style={styles.muscleGroupContainer}>
            {Object.keys(muscleGroupLabels).map(key => {
              const group = key as MuscleGroup;
              const isSelected = selectedGroups.includes(group);
              return (
                <TouchableOpacity 
                  key={group}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleMuscleGroup(group)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {muscleGroupLabels[group]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Exercício</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, color: '#666', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  muscleGroupContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  chip: { backgroundColor: '#f0f0f0', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, margin: 4 },
  chipSelected: { backgroundColor: '#007AFF' },
  chipText: { color: '#333' },
  chipTextSelected: { color: '#fff' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  saveButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
